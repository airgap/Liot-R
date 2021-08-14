import { request } from 'express';

export const sendDataToCallback = (data, url) => {
	if (!url.match(/^[A-Za-z]+:\/\//)) url = 'http://' + url;
	return request.post({
		headers: { 'content-type': 'application/json' },
		url: url,
		body: data,
		json: true
	});
};
