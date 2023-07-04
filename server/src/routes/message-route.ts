import { Router } from 'express';
import { getMessageId, sendImage, sendMessage } from '../controller/message-controller';
import MiddlewareAuth from './middleware';

const messageRoute = Router();

messageRoute.use(MiddlewareAuth);

messageRoute.post('/', sendMessage);
messageRoute.post('/image', sendImage);
messageRoute.get('/:userId/:contactId/all', getMessageId);

export default messageRoute;
