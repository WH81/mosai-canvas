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


## ------------------------------
## Start up backend environment
## ------------------------------
ts-node src/server.ts

## ------------------------------
## Start up frontend environment
## ------------------------------
npm start


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



## -----------------------------------
## Postman Endpoint - Releases
## -----------------------------------
PUT
http://localhost:5001/api/releases

## -----------------------------------
## Postman Payload - Releases
## -----------------------------------
{
  "title": "All Alright - Single",
  "artist": "WAILING CANVAS",
  "album": "In No Particular Order",
  "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f8/93/d3/f893d3a8-ab16-ba74-cdff-987992bab469/artwork.jpg/632x632bf.webp",
  "releaseDate": "2023-10-06T00:00:00.000Z",
  "type": "past-release",
  "appleMusicUrl": "https://music.apple.com/us/album/all-alright-wailing-canvas-single/1844218445",
  "spotifyUrl": "https://open.spotify.com/track/3vYn70PdOUEwbfN8F8hMks",
  "youtubeUrl": "https://www.youtube.com/watch?v=tBT3cAfBMls&list=RDtBT3cAfBMls&start_radio=1"
}


## -----------------------------------
## Postman Endpoint - Releases
## -----------------------------------
PUT
http://localhost:5001/api/releases/<Releases_Id>

## -----------------------------------
## Postman Payload - Releases
## -----------------------------------
{
  "title": "All Alright - Single",
  "artist": "WAILING CANVAS",
  "album": "In No Particular Order",
  "coverUrl": "https://scontent-mia3-3.xx.fbcdn.net/v/t39.30808-6/540963928_122102506658992388_191597932622474841_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=Fy8l4L1R3jIQ7kNvwHcZbQd&_nc_oc=Adn6Z7JjRfAtaIMIB5WiVvf2_lwP4cPPYw8wyxSgBNgTDAVqiHyfC5-3oktFm74eFkw&_nc_zt=23&_nc_ht=scontent-mia3-3.xx&_nc_gid=Ne-zyHRYCWlFUi-YyzIxbA&oh=00_AfcAqxCDR3K0elAsyRgooHMYLvKc1mdlaT2bGcqkSB64Zg&oe=690C02DC",
  "releaseDate": "2023-10-06T00:00:00.000Z",
  "type": "past-release",
  "appleMusicUrl": "https://music.apple.com/us/album/all-alright-wailing-canvas-single/1844218445",
  "spotifyUrl": "https://open.spotify.com/track/3vYn70PdOUEwbfN8F8hMks",
  "youtubeUrl": "https://www.youtube.com/watch?v=tBT3cAfBMls&list=RDtBT3cAfBMls&start_radio=1"
}
