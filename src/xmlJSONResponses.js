const respond = (request, response, code, object, respondJSON) => {
  let content;

  if (respondJSON) {
    content = JSON.stringify(object);
  } else {
    content = `<response><message>${object.message}</message>`;
    if (object.id) content += `<id>${object.id}</id>`;
    content += '</response>';
  }

  response.writeHead(code, {
    'Content-Type': (respondJSON) ? 'application/json' : 'text/xml',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  console.log(content);
  response.write(content);
  response.end();
};

const getXMLJSON = (request, response, parsedUrl, respondJSON = true) => {
  const object = { };
  const { searchParams } = parsedUrl;
  let status;

  switch (parsedUrl.pathname) {
    case '/success':
      object.message = 'This is a successful response.';
      status = 200;
      break;
    case '/badRequest':
      if (searchParams.get('valid') && searchParams.get('valid') === 'true') {
        object.message = 'This is a successful response';
        status = 200;
      } else {
        object.message = 'Missing valid query parameter set to true.';
        object.id = 'badRequest';
        status = 400;
      }
      break;
    case '/unauthorized':
      if (searchParams.get('loggedIn') && searchParams.get('loggedIn') === 'yes') {
        object.message = 'This is a successful response';
        status = 200;
      } else {
        object.message = 'Missing loggedIn query parameter set to yes.';
        object.id = 'unauthorized';
        status = 401;
      }
      break;
    case '/forbidden':
      object.message = 'You do not have access to this content';
      object.id = 'forbidden';
      status = 403;
      break;
    case '/internal':
      object.message = 'Internal Server Error. Something went wrong.';
      object.id = 'internal';
      status = 500;
      break;
    case '/notImplemented':
      object.message = 'A get request for this page has not been implemented yet. Check again later for updated content.';
      object.id = 'notImplemented';
      status = 501;
      break;
    default:
      object.message = 'The page you were looking for was not found.';
      object.id = 'notFound';
      status = 404;
      break;
  }

  respond(request, response, status, object, respondJSON);
};

module.exports.getXMLJSON = getXMLJSON;
