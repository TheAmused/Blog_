export const config = {
   port: process.env.PORT || 3000,
   supportedPostCount: 15,
   databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://'
};

