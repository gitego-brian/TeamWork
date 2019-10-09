import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes1 from './v1/routes/userRoutes';
import articleRoutes1 from './v1/routes/articleRoutes';
import articleRoutes2 from './v2/routes/articleRoutes';

import userRoutes2 from './v2/routes/userRoutes';

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

// ROUTING
app.get('/', (_req, res) => {
	res.status(200).send({
		status: 200,
		message:
			'Welcome to TeamWork!, go to  https://documenter.getpostman.com/view/8741834/SVtPXARF?version=latest  or go to the REPO at https://github.com/gitego-brian/TeamWork for documentation'
	});
});

// VERSION ONE
app.use('/api/v1/auth', userRoutes1);
app.use('/api/v1/articles', articleRoutes1);

// VERSION TWO
app.use('/api/v2/auth', userRoutes2);
app.use('/api/v2/articles', articleRoutes2);

// Error handling
app.use('/*', (_req, res) => {
	res.status(404).send({ status: 404, error: 'Not Found' });
});

app.use((error, _req, res, _next) => {
	if (error.status === 400) {
		res.status(error.status || 500);
		res.json({
			error: {
				message: 'Syntax error, Please double check your input'
			}
		});
	} else {
		res.status(error.status || 500);
		res.json({
			error: {
				message: 'Oops, Server down'
			}
		});
	}
});

app.listen(port);

export default app;
