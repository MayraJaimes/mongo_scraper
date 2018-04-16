# mongo_scraper

The Mongo Scraper web app lets users view, save, and leave comments on the latest health news. With the help of the Cheerio npm and mongoose this app scrapes news from the Science Journal Daily website.

Whenever a user visits the site, the app scrapes stories from the news outlet "Science Journal Daily" and displays them to the user. Each scraped article is saved to the application database. The app scrapes and displays the following information for each article:

Headline: the title of the article
Summary: a short summary of the article
URL: the url to the original article

Users are also able to leave comments on the articles displayed and revisit them later. The comments are saved to the database as well and associated with their articles. Users are not able to delete comments left on articles since they are not required to log in. All stored comments are be visible to every user.

Users also have the ability to save articles which will then be shown in the "saved" page of the app.

Technologies used:
-Node
-Express
-Express-Handlebars
-Mongoose
-Cheerio
