/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './../controllers/user.tsoa.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RecipeController } from './../controllers/recipe.tsoa.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LikesController } from './../controllers/like.tsoa.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CommentsController } from './../controllers/comments.tsoa.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth.tsoa.js';
import { expressAuthentication } from './../common/middlewares/expressAuthentication.js';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
import multer from 'multer';


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserRole": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["admin"]},{"dataType":"enum","enums":["user"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SafeUser": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "avatarUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "settings": {"ref":"Record_string.any_"},
            "role": {"ref":"UserRole","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserDTO": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "passwordHash": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "avatarUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "settings": {"ref":"Record_string.any_"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_UserDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string"},"passwordHash":{"dataType":"string"},"name":{"dataType":"string"},"avatarUrl":{"dataType":"string"},"settings":{"ref":"Record_string.any_"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserDTO": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_UserDTO_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Difficulty": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["easy"]},{"dataType":"enum","enums":["medium"]},{"dataType":"enum","enums":["hard"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IngredientInput": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "quantity": {"dataType":"double"},
            "unit": {"dataType":"string"},
            "notes": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StepInput": {
        "dataType": "refObject",
        "properties": {
            "index": {"dataType":"double"},
            "instruction": {"dataType":"string","required":true},
            "durationMinutes": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SourceType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ai"]},{"dataType":"enum","enums":["manual"]},{"dataType":"enum","enums":["import"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["draft"]},{"dataType":"enum","enums":["published"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeComment": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "text": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeDTO": {
        "dataType": "refObject",
        "properties": {
            "Id": {"dataType":"string"},
            "recipeBookId": {"dataType":"string"},
            "originalRecipeId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "creatorName": {"dataType":"string"},
            "categories": {"dataType":"array","array":{"dataType":"string"}},
            "prepTimeMinutes": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}]},
            "cookTimeMinutes": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}]},
            "totalTimeMinutes": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}]},
            "difficulty": {"ref":"Difficulty"},
            "ingredients": {"dataType":"array","array":{"dataType":"refObject","ref":"IngredientInput"},"required":true},
            "steps": {"dataType":"array","array":{"dataType":"refObject","ref":"StepInput"},"required":true},
            "notes": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "coverImageUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "sourceType": {"ref":"SourceType"},
            "sourceId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "status": {"ref":"RecipeStatus"},
            "createdBy": {"dataType":"string"},
            "likes": {"dataType":"array","array":{"dataType":"string"}},
            "comments": {"dataType":"array","array":{"dataType":"refObject","ref":"RecipeComment"}},
            "createdAt": {"dataType":"string"},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedRecipes": {
        "dataType": "refObject",
        "properties": {
            "recipes": {"dataType":"array","array":{"dataType":"refObject","ref":"RecipeDTO"},"required":true},
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_RecipeDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"Id":{"dataType":"string"},"recipeBookId":{"dataType":"string"},"originalRecipeId":{"dataType":"string"},"title":{"dataType":"string"},"description":{"dataType":"string"},"creatorName":{"dataType":"string"},"categories":{"dataType":"array","array":{"dataType":"string"}},"prepTimeMinutes":{"dataType":"double"},"cookTimeMinutes":{"dataType":"double"},"totalTimeMinutes":{"dataType":"double"},"difficulty":{"ref":"Difficulty"},"ingredients":{"dataType":"array","array":{"dataType":"refObject","ref":"IngredientInput"}},"steps":{"dataType":"array","array":{"dataType":"refObject","ref":"StepInput"}},"notes":{"dataType":"string"},"coverImageUrl":{"dataType":"string"},"sourceType":{"ref":"SourceType"},"sourceId":{"dataType":"string"},"status":{"ref":"RecipeStatus"},"createdBy":{"dataType":"string"},"likes":{"dataType":"array","array":{"dataType":"string"}},"comments":{"dataType":"array","array":{"dataType":"refObject","ref":"RecipeComment"}},"createdAt":{"dataType":"string"},"updatedAt":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommentDTO": {
        "dataType": "refObject",
        "properties": {
            "recipeId": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
            "id": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateCommentRequest": {
        "dataType": "refObject",
        "properties": {
            "recipeId": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCommentDTO": {
        "dataType": "refObject",
        "properties": {
            "content": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"user":{"ref":"SafeUser","required":true},"refreshToken":{"dataType":"string","required":true},"token":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"language":{"dataType":"string"},"avatarUrl":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"name":{"dataType":"string","required":true},"password":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsUsersController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"UserDTO"},
        };
        app.post('/api/users/createUser',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.createUser)),

            async function UsersController_createUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_createUser, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsersController_getUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/users/getUsers',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUsers)),

            async function UsersController_getUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getUsers, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsersController_getUserById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/users/getUserById/:id',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserById)),

            async function UsersController_getUserById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getUserById, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsersController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateUserDTO"},
        };
        app.put('/api/users/updateUser/:id',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateUser)),

            async function UsersController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_updateUser, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsersController_updateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"avatarUrl":{"dataType":"string"},"name":{"dataType":"string"}}},
        };
        app.patch('/api/users/updateProfile/:id',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateProfile)),

            async function UsersController_updateProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_updateProfile, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'updateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsersController_uploadAvatar: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                file: {"in":"formData","name":"file","required":true,"dataType":"file"},
        };
        app.post('/api/users/:id/uploadAvatar',
            upload.fields([
                {
                    name: "file",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.uploadAvatar)),

            async function UsersController_uploadAvatar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_uploadAvatar, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'uploadAvatar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsersController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/api/users/deleteUser/:id',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.deleteUser)),

            async function UsersController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_deleteUser, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_uploadImage: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                file: {"in":"formData","name":"file","required":true,"dataType":"file"},
        };
        app.post('/api/recipes/:id/image',
            authenticateMiddleware([{"jwt":[]}]),
            upload.fields([
                {
                    name: "file",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.uploadImage)),

            async function RecipeController_uploadImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_uploadImage, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'uploadImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_getRecipes: Record<string, TsoaRoute.ParameterSchema> = {
                recipeBookId: {"in":"query","name":"recipeBookId","dataType":"string"},
                status: {"in":"query","name":"status","dataType":"any"},
                difficulty: {"in":"query","name":"difficulty","dataType":"any"},
                search: {"in":"query","name":"search","dataType":"string"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/api/recipes/getRecipes',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.getRecipes)),

            async function RecipeController_getRecipes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_getRecipes, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'getRecipes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_createRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"RecipeDTO"},
        };
        app.post('/api/recipes/createRecipe',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.createRecipe)),

            async function RecipeController_createRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_createRecipe, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'createRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_getRecipeById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/recipes/getRecipeById/:id',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.getRecipeById)),

            async function RecipeController_getRecipeById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_getRecipeById, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'getRecipeById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_updateRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"Partial_RecipeDTO_"},
        };
        app.put('/api/recipes/updateRecipe/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.updateRecipe)),

            async function RecipeController_updateRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_updateRecipe, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'updateRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_deleteRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/api/recipes/deleteRecipe/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.deleteRecipe)),

            async function RecipeController_deleteRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_deleteRecipe, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'deleteRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_incrementViews: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.patch('/api/recipes/:id/view',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.incrementViews)),

            async function RecipeController_incrementViews(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_incrementViews, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'incrementViews',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_incrementCooked: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.patch('/api/recipes/:id/cooked',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.incrementCooked)),

            async function RecipeController_incrementCooked(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_incrementCooked, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'incrementCooked',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeController_aiSearch: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"query","name":"query","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                recipeBookId: {"in":"query","name":"recipeBookId","dataType":"string"},
        };
        app.get('/api/recipes/ai-search',
            ...(fetchMiddlewares<RequestHandler>(RecipeController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeController.prototype.aiSearch)),

            async function RecipeController_aiSearch(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeController_aiSearch, request, response });

                const controller = new RecipeController();

              await templateService.apiHandler({
                methodName: 'aiSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLikesController_addLike: Record<string, TsoaRoute.ParameterSchema> = {
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/api/likes/:recipeId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LikesController)),
            ...(fetchMiddlewares<RequestHandler>(LikesController.prototype.addLike)),

            async function LikesController_addLike(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLikesController_addLike, request, response });

                const controller = new LikesController();

              await templateService.apiHandler({
                methodName: 'addLike',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLikesController_removeLike: Record<string, TsoaRoute.ParameterSchema> = {
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/api/likes/:recipeId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LikesController)),
            ...(fetchMiddlewares<RequestHandler>(LikesController.prototype.removeLike)),

            async function LikesController_removeLike(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLikesController_removeLike, request, response });

                const controller = new LikesController();

              await templateService.apiHandler({
                methodName: 'removeLike',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentsController_createComment: Record<string, TsoaRoute.ParameterSchema> = {
                input: {"in":"body","name":"input","required":true,"ref":"CreateCommentRequest"},
        };
        app.post('/api/comments/create',
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.createComment)),

            async function CommentsController_createComment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentsController_createComment, request, response });

                const controller = new CommentsController();

              await templateService.apiHandler({
                methodName: 'createComment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentsController_getCommentById: Record<string, TsoaRoute.ParameterSchema> = {
                commentId: {"in":"path","name":"commentId","required":true,"dataType":"string"},
        };
        app.get('/api/comments/getCommentById/:commentId',
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.getCommentById)),

            async function CommentsController_getCommentById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentsController_getCommentById, request, response });

                const controller = new CommentsController();

              await templateService.apiHandler({
                methodName: 'getCommentById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentsController_getCommentsByRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"string"},
        };
        app.get('/api/comments/recipe/getCommentsByRecipe/:recipeId',
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.getCommentsByRecipe)),

            async function CommentsController_getCommentsByRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentsController_getCommentsByRecipe, request, response });

                const controller = new CommentsController();

              await templateService.apiHandler({
                methodName: 'getCommentsByRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentsController_updateComment: Record<string, TsoaRoute.ParameterSchema> = {
                commentId: {"in":"path","name":"commentId","required":true,"dataType":"string"},
                input: {"in":"body","name":"input","required":true,"ref":"UpdateCommentDTO"},
        };
        app.put('/api/comments/update/:commentId',
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.updateComment)),

            async function CommentsController_updateComment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentsController_updateComment, request, response });

                const controller = new CommentsController();

              await templateService.apiHandler({
                methodName: 'updateComment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentsController_deleteComment: Record<string, TsoaRoute.ParameterSchema> = {
                commentId: {"in":"path","name":"commentId","required":true,"dataType":"string"},
        };
        app.delete('/api/comments/delete/:commentId',
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.deleteComment)),

            async function CommentsController_deleteComment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentsController_deleteComment, request, response });

                const controller = new CommentsController();

              await templateService.apiHandler({
                methodName: 'deleteComment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"RegisterDTO"},
        };
        app.post('/api/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginDTO"},
        };
        app.post('/api/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_refresh: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true}}},
        };
        app.post('/api/auth/refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.refresh)),

            async function AuthController_refresh(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_refresh, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'refresh',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_logout: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true}}},
        };
        app.post('/api/auth/logout',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            async function AuthController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_logout, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
