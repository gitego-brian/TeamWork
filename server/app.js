import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config(); // configuring environment variables

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.get('/', (_req, res) => {
	res.status(200).send({
		status: 200,
		message: 'Welcome to TeamWork!'
	});
});
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/articles', articleRoutes);

app.listen(port);

// Error handling
app.use('/*', (res) => {
	res.status(404).send({ error: 'Not Found' });
});

app.use((error, _req, res, _next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});
export default app;
