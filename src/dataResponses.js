const response = (req, res, status, object) => {
  const { acceptedTypes } = req;
  let content = object;

  if (acceptedTypes.includes('application/json')) {
    content = JSON.stringify(object);
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
  } else if (acceptedTypes.includes('text/xml')) {
    res.writeHead(status, {
      'Content-Type': 'text/xml',
      'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
  }

  res.write(content);
  res.end();
};

const success = (req, res) => {
  const { acceptedTypes } = req;
  let object;

  if (acceptedTypes.includes('application/json')) {
    object = {
      message: 'This is a successful response.',
    };
  } else if (acceptedTypes.includes('text/xml')) {
    object = '<response><message>This is a successful response.</message></response>';
  }
  console.log(object);

  response(req, res, 200, object);
};

const jsonToXML = (message, id) => `<response><message>${message}</message><id>${id}</id></response>`;

const badRequest = (req, res) => {
  const { acceptedTypes } = req;
  let object = {
    message: 'This request has the required parameters.',
  };

  if (!req.query.valid || req.query.valid !== 'true') {
    object.message = 'Missing valid query parameter set to true.';
    object.id = 'badRequest';

    if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
      object = jsonToXML(object.message, object.id);
    }

    return response(req, res, 400, object);
  }

  if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
    object = '<response><message>This request has the required parameters.</message></response>';
  }

  return response(req, res, 200, object);
};

const unauthorized = (req, res) => {
  const { acceptedTypes } = req;
  let object = {
    message: 'You have successfully viewed the content.',
  };

  if (req.query.loggedIn !== 'yes') {
    object.message = 'Missing loggedIn query parameter set to yes.';
    object.id = 'unauthorized';

    if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
      object = jsonToXML(object.message, object.id);
    }

    return response(req, res, 401, object);
  }

  if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
    object = '<response><message>This request has the required parameters.</message></response>';
  }

  return response(req, res, 200, object);
};

const forbidden = (req, res) => {
  const { acceptedTypes } = req;
  let object = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
    object = jsonToXML(object.message, object.id);
  }

  return response(req, res, 403, object);
};

const internal = (req, res) => {
  const { acceptedTypes } = req;
  let object = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
    object = jsonToXML(object.message, object.id);
  }

  response(req, res, 500, object);
};

const notImplemented = (req, res) => {
  const { acceptedTypes } = req;
  let object = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
    object = jsonToXML(object.message, object.id);
  }

  response(req, res, 501, object);
};

const notFound = (req, res) => {
  const { acceptedTypes } = req;
  let object = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  if (acceptedTypes.includes('text/xml') || !acceptedTypes.includes('application/json')) {
    object = jsonToXML(object.message, object.id);
  }

  response(req, res, 404, object);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
