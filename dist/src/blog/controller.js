"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = void 0;
const model_1 = __importDefault(require("./model"));
const mongoose_1 = __importDefault(require("mongoose"));
class BlogService {
    constructor() {
        this.blog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogs = yield model_1.default.find().sort({ createdAt: -1 });
            return res.json(blogs);
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = req.params.id;
                if (!mongoose_1.default.isValidObjectId(blogId)) {
                    return res.status(400).json({ message: 'Invalid blog ID' });
                }
                const blog = yield model_1.default.findById(blogId);
                if (!blog) {
                    return res.status(404).json({ message: 'Blog not found' });
                }
                return res.json(blog);
            }
            catch (error) {
                console.error('Error showing blog:', error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { title, description, content } = req.body;
            try {
                const existingBlog = yield model_1.default.findOne({ title });
                if (existingBlog) {
                    return res.status(400).json({ message: 'A blog with the same title already exists' });
                }
                const newBlog = new model_1.default({
                    title,
                    description,
                    content
                });
                yield newBlog.save();
                return res.json({ message: 'Blog successfully created', createdBlog: newBlog });
            }
            catch (error) {
                console.error('Error creating blog:', error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            const { title, description, content } = req.body;
            try {
                if (!mongoose_1.default.isValidObjectId(blogId)) {
                    return res.status(400).json({ message: 'Invalid blog ID' });
                }
                const blog = yield model_1.default.findByIdAndUpdate(blogId, { title, description, content }, { new: true });
                if (!blog) {
                    return res.status(404).json({ message: 'Blog not found' });
                }
                return res.json({ message: 'Blog successfully updated', updatedBlog: blog });
            }
            catch (error) {
                console.error('Error updating blog:', error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
        this.destroy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            try {
                if (!mongoose_1.default.isValidObjectId(blogId)) {
                    return res.status(400).json({ message: 'Invalid blog ID' });
                }
                const blog = yield model_1.default.findByIdAndDelete(blogId);
                if (!blog) {
                    return res.status(404).json({ message: 'Blog not found' });
                }
                return res.json({ message: 'Blog successfully deleted', deletedBlog: blog });
            }
            catch (error) {
                console.error('Error deleting blog:', error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
    }
}
exports.blogService = new BlogService();
