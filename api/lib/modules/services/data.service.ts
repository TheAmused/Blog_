import { IData, Query } from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
    public async createPost(postParams: IData) {
        try {
            const dataModel = new PostModel(postParams);
            await dataModel.save();
        } catch (error) {
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            const result = await PostModel.find(query, { __v: 0 });
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async getById(id: string) {
        try {
            return await PostModel.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } },
                { new: true, projection: { __v: 0 } }
            );
        } catch (error) {
            throw new Error(`Error getting post by id: ${error}`);
        }
    }

    public async deleteById(id: string) {
        try {
            await PostModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting post by id: ${error}`);
        }
    }

    public async deleteAllPosts() {
        try {
            await PostModel.deleteMany({});
        } catch (error) {
            throw new Error(`Error deleting all posts: ${error}`);
        }
    }

    public async updatePost(id: string, data: any) {
        try {
            return await PostModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error(`Error updating post: ${error}`);
        }
    }

    public async addComment(postId: string, text: string, userId: string) {
        const comment = { userId, text, date: new Date() };
        await PostModel.findByIdAndUpdate(postId, { $push: { comments: comment } });
        return comment;
    }

    public async removeComment(postId: string, commentId: string) {
        await PostModel.findByIdAndUpdate(postId, {
            $pull: { comments: { _id: commentId } }
        });
    }

    public async updateComment(postId: string, commentId: string, newText: string) {
        await PostModel.updateOne(
            { _id: postId, "comments._id": commentId },
            { $set: { "comments.$.text": newText } }
        );
    }
    
    public async deletePost(postId: string) {
        return PostModel.findByIdAndDelete(postId);
    }

    public async getPostsWithPagination(page: number, limit: number, titleFilter: string = '') {
        try {
            const query = titleFilter
                ? { title: { $regex: titleFilter, $options: 'i' } }
                : {};

            const skip = (page - 1) * limit;

            const items = await PostModel.find(query, { __v: 0 })
                .skip(skip)
                .limit(limit)
                .sort({ _id: -1 });

            const totalCount = await PostModel.countDocuments(query);

            return { items, totalCount };
        } catch (error) {
            throw new Error(`Pagination query failed: ${error}`);
        }
    }

    public async toggleLike(postId: string, userId: string) {
        try {
            const post: any = await PostModel.findById(postId);

            if (!post) {
                throw new Error('Post not found');
            }

            if (!post.likes) {
                post.likes = [];
            }

            const index = post.likes.indexOf(userId);
            let isLiked = false;

            if (index === -1) {
                post.likes.push(userId);
                isLiked = true;
            } else {
                post.likes.splice(index, 1);
                isLiked = false;
            }

            post.markModified('likes');
            await post.save();

            return { 
                likesCount: post.likes.length, 
                isLiked: isLiked 
            };
        } catch (error) {
            throw error;
        }
    }
}

export default DataService;