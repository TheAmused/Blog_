import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import DataService from '../modules/services/data.service';

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class PostController implements Controller {
    public path = '/api/post';
    public pathPlural = '/api/posts';
    public router = Router();
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getAll);
        this.router.post(`${this.path}/take/:num`, checkPostCount, this.getNPosts);
        
        this.router.delete(`${this.path}/comment/:id/:commentId`, this.deleteCommentRoute);
        this.router.put(`${this.path}/comment/:id/:commentId`, this.updateCommentRoute);
        this.router.post(`${this.path}/comment/:id`, this.addCommentRoute);

        this.router.post(this.path, this.addData); 
        this.router.put(`${this.path}/:id`, this.editPost); 
        this.router.delete(`${this.path}/:id`, this.removePost);
        this.router.get(`${this.path}/:id`, this.getElementById);
        
        this.router.post(`${this.path}/like/:id`, this.toggleLikePost);
        
        this.router.get(this.pathPlural, this.getAllPosts);
        this.router.delete(this.pathPlural, this.deleteAllPosts);
    }

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json(testArr);
    };

    private getNPosts = async (request: Request, response: Response, next: NextFunction) => {
        const { num } = request.params;
        const count = parseInt(num, 10);
        if (isNaN(count) || count <= 0) {
             return response.status(400).json({ error: 'Podano nieprawidłową liczbę elementów.' });
        }
        const elements = testArr.slice(0, count);
        response.status(200).json(elements);
    };

    private addCommentRoute = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { text, userId } = request.body;
        
        try {
            const newComment = await this.dataService.addComment(id, text, userId);
            response.json(newComment);
        } catch (error) {
            response.status(500).json({ error: 'Error adding comment' });
        }
    };

    private deleteCommentRoute = async (request: Request, response: Response) => {
        const { id, commentId } = request.params;
        try {
            await this.dataService.removeComment(id, commentId);
            response.sendStatus(200);
        } catch (error) {
            response.status(500).json({ error: 'Error deleting comment' });
        }
    };

    private updateCommentRoute = async (request: Request, response: Response) => {
        const { id, commentId } = request.params;
        const { text } = request.body;
        try {
            await this.dataService.updateComment(id, commentId, text);
            response.sendStatus(200);
        } catch (error) {
            response.status(500).json({ error: 'Error updating comment' });
        }
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { title, text, image, userId } = request.body; 
        
        if (!userId) {
            return response.status(400).json({ error: 'User ID is required' });
        }

        const readingData = { title, text, image, userId };
        
        try {
            await this.dataService.createPost(readingData);
            response.status(200).json(readingData);
        } catch (error: any) {
            console.error(error);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };


    private editPost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const { title, text, image } = request.body;
        
        try {
            const updatedPost = await this.dataService.updatePost(id, { title, text, image });
            if (updatedPost) {
                response.status(200).json(updatedPost);
            } else {
                response.status(404).json({ error: 'Post not found' });
            }
        } catch (error) {
            response.status(500).json({ error: 'Error updating post' });
        }
    };

    private getElementById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                response.status(404).json({ error: 'Post not found' });
            } else {
                response.status(200).json(post);
            }
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    };

    private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        try {
            await this.dataService.deleteById(id);
            response.sendStatus(200);
        } catch (error) {
            response.status(500).json({ error: 'Error deleting post' });
        }
    };
    
    private getAllPosts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const page = Number(request.query.page) || 1;
            const limit = Number(request.query.limit) || 4;
            const search = request.query.title?.toString() || '';
            const result = await this.dataService.getPostsWithPagination(page, limit, search);
            response.status(200).json(result);
        } catch (error) {
            response.status(500).json({ error: 'Failed to fetch posts' });
        }
    };

    private deleteAllPosts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json({ message: 'Wszystkie posty z bazy usunięte.' });
        } catch (error) {
            response.status(500).json({ error: 'Failed to delete posts' });
        }
    };

    private toggleLikePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const { userId } = request.body;

        if (!userId) {
            return response.status(400).json({ error: 'Brak userId' });
        }

        try {
            const result = await this.dataService.toggleLike(id, userId);
            response.status(200).json(result);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Błąd serwera podczas lajkowania' });
        }
    };
}

export default PostController;