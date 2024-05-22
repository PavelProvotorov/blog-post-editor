import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import fastifyHelmet from '@fastify/helmet';
import fastifyView from '@fastify/view';
import Handlebars from 'handlebars';
import { app_routes, path_routes } from './routes.js'
import { ADD_POST } from './schemes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: false,
    ajv: {
        customOptions: {
            removeAdditional: true,
            useDefaults: true,
            coerceTypes: true,
            allErrors: true
        }
    }
});

fastify.addSchema(ADD_POST)
fastify.register(path_routes)
fastify.register(app_routes)

// Auth
fastify.decorate('verifyCredentials', async function (request, reply, done) {
    if (process.env.ADMIN_USERNAME === "admin" && process.env.ADMIN_PASSWORD === "zone") {
        reply.setCookie("blog-session", "token", {
            path: "/app",
            signed: true,
            sameSite: true,
            httpOnly: true,
            secure: true
        })
        return
    } else {
        reply.redirect('/login');
    }
});


fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
    algorithm: "sha256",
    parseOptions: {
        secure: false
    }
});

fastify.register(fastifyHelmet, { 
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "base-uri": ["'self'"],
                "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                "style-src": ["'self'", "https://fonts.googleapis.com", "https://fonts.cdnfonts.com", "'unsafe-inline'"],
                "font-src": ["'self'", "https://fonts.gstatic.com", "https://fonts.cdnfonts.com"]
            }
        },
        global: true,
    }
);

fastify.register(fastifyView, {
    engine: {
        handlebars: Handlebars,
    },
    includeViewExtension: true,
    root: path.join(__dirname, "views"),
    viewExt: "hbs",
    propertyName: "view",
    options: {
        partials: {
            head: '/partials/head.hbs',
            main: '/partials/main.hbs',
            header: '/partials/header.hbs',
            footer: '/partials/footer.hbs',
            editor: '/partials/editor.hbs',
            posts: '/partials/posts.hbs',
        }
    }
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname,'../client/public'),
    prefix: '/app',
    serve: true,
    constraints: {}
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname,'../client/public'),
    prefix: '/',
    serve: true,
    decorateReply: false
});

export {
    fastify
};