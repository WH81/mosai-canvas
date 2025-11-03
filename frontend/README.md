# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## ----------------------------------------------------------------------
## Postman API Call Documentation
## ----------------------------------------------------------------------

## -----------------------------------
## Postman Endpoint - Members
## -----------------------------------
PUT
http://localhost:5001/api/members/<Members_Id_Here>

## -----------------------------------
## Postman Payload - Members
## -----------------------------------
{
    "name": "firstname lastname",
    "instrument": "instrument",
    "band": "<Bands_Id_Here>",
    "bandSlug": "band-canvas",
    "image": "./assets/jpgs/image.jpg",
    "bio": "bio message here",
    "socialLinks": {
        "instagram": "https://www.instagram.com/path"
    }
}


## -----------------------------------
## Postman Endpoint - Members
## -----------------------------------
POST
http://localhost:5001/api/members

## -----------------------------------
## Postman Payload - Members
## -----------------------------------
{
  "name": "firstname lastname",
  "instrument": "instrument",
  "band": "<Band_Id_Here>",
  "bandSlug": "band-canvas",
  "image": "./assets/jpgs/image.jpg",
  "bio": "bio message here",
  "socialLinks": {
    "instagram": "https://www.instagram.com/path"
  }
}


## -----------------------------------
## Postman Endpoint - Members
## -----------------------------------
DELETE
http://localhost:5001/api/members/<Member_Id_Here>


## -----------------------------------
## Postman Endpoint - Carousel
## -----------------------------------
PUT
http://localhost:5001/api/carousel/<Carousel_Item_Id>

## -----------------------------------
## Postman Payload - Carousel
## -----------------------------------
{
    "imageUrl": "domain address",
    "bandName": "band name",
    "songName": "song name",
    "releaseDate": "2025-10-20",
    "buttonText": "Listen Now",
    "buttonLink": "https://youtube.com"
}