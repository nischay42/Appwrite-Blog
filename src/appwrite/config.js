import conf from "../conf/conf.js";
import { Client, Storage, ID, Databases, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      )
    } catch (error) {
      console.log("Apprite service :: createPost :: error", error);
    }
  }
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      )
    } catch (error) {
      console.log("Apprite service :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
      return true;
    } catch (error) {
      console.log("Apprite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log("Apprite service :: getPost :: error", error);
      return false;
    }
  }

  // async getPost(limit = 20, offset = 0) {
  //   try {
  //     return await this.databases.listDocuments(
  //       conf.appwriteDatabaseId,
  //       conf.appwriteCollectionId,
  //       [
  //         Query.limit(limit),
  //         Query.offset(offset)
  //       ]
  //     );
  //   } catch (error) {
  //     console.log("Appwrite service :: getPost :: error", error);
  //     return false;
  //   }
  // }

  // async getPost(queries = [Query.limit(100), Query.offset(0)]) {
  //   try {
  //     return await this.databases.listDocuments(
  //       conf.appwriteDatabaseId,
  //       conf.appwriteCollectionId,
  //       queries
  //     );
  //   } catch (error) {
  //     console.log("Appwrite service :: getPost :: error", error);
  //     return false;
  //   }
  // }
  

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      )
    } catch (error) {
      console.log("Apprite service :: getPosts :: error", error);
      return false;
    }
  }

  // file upload service

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      )
    } catch (error) {
      console.log("Apprite service :: uploadFile :: error", error);
      return false
    }
  }

  async deleteFile(fileID){
    try {
        await this.bucket.deleteFile(
            conf.appwriteBucketId,
            fileID
        )
        return true
    } catch (error) {
        console.log("Apprite service :: deleteFile :: error", error);
        return false
    }
  }

  getFilePreview(fileID){
    return this.bucket.getFileView(
        conf.appwriteBucketId,
        fileID
    )
  }
}

const appwriteService = new Service();
export default appwriteService;
