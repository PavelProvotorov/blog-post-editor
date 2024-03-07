import Fastify from 'fastify'
import fastifyStatic from '@fastify/static';
import fastifyHelmet from '@fastify/helmet';
import routes from './routes.js'
import { ADD_POST } from './schemes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true,
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

// API Routes
fastify.register(routes)

// CSP Cofiguration
fastify.register(fastifyHelmet, { 
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "base-uri": ["'self'"],
                "script-src": ["'self'", "'sha256-pgn1TCGZX6O77zDvy0oTODMOxemn0oj0LeCnQTRj7Kg='", "'unsafe-eval'"],
                "style-src": ["'self'", "https://fonts.googleapis.com", "'sha256-pgn1TCGZX6O77zDvy0oTODMOxemn0oj0LeCnQTRj7Kg='"],
                "font-src": ["'self'", "https://fonts.gstatic.com"]
            }
        },
        global: true,
    }
);

// Static Cofiguration
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'client', 'public'),
    prefix: '/',
    constraints: {}
});

fastify.get('/', function (request, reply) {
    reply.redirect('/index.html')
});

fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});