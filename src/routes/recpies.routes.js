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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var recpies_model_js_1 = require("../models/recpies.model.js");
var router = express_1.default.Router();
/* ============================================================
   1️⃣ Create a New Recipe
   POST /recipes
============================================================ */
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recipe, err_1, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                recipe = new recpies_model_js_1.RecipeModel(req.body);
                return [4 /*yield*/, recipe.save()];
            case 1:
                _a.sent();
                console.log("got here");
                res.status(201).json(recipe);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                console.error("Error creating recipe:", err_1);
                res.status(500).json({ error: errorMessage });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* ============================================================
   2️⃣ Get All Recipes
   GET /recipes
============================================================ */
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, recpies_model_js_1.RecipeModel.find()];
            case 1:
                posts = _a.sent();
                res.json(posts);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error("Error fetching recipes:", err_2);
                res.status(500).json({ error: "Failed to fetch recipes" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* ============================================================
   3️⃣ Get Recipe by ID
   GET /recipes/:id
============================================================ */
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, recpies_model_js_1.RecipeModel.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ error: "Recipe not found" })];
                res.json(post);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error("Invalid ID:", err_3);
                res.status(400).json({ error: "Invalid ID format" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* ============================================================
   4️⃣ Get Recipes by createdBy
   GET /recipes/createdBy/:createdBy
============================================================ */
router.get("/createdBy/:createdBy", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, recpies_model_js_1.RecipeModel.find({ createdBy: req.params.createdBy })];
            case 1:
                posts = _a.sent();
                res.json(posts);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error("Error fetching recipes by createdBy:", err_4);
                res.status(500).json({ error: "Failed to fetch recipes by createdBy" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* ============================================================
   5️⃣ Update a Recipe
   PUT /recipes/:id
============================================================ */
router.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedPost, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, recpies_model_js_1.RecipeModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })];
            case 1:
                updatedPost = _a.sent();
                if (!updatedPost)
                    return [2 /*return*/, res.status(404).json({ error: "Recipe not found" })];
                res.json(updatedPost);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.error("Update failed:", err_5);
                res.status(400).json({ error: "Invalid data or recipe ID" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
