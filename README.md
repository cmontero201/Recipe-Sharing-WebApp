{\rtf1\ansi\ansicpg1252\cocoartf2511
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 CS546 - Web Programming I\
Summer Session 2019 WS\
\
This project aims to create a web application that meets the following features:\
\
Core Features:\
User must login to view posts; if the user does not have an account, they must sign up.\
User may create posts of their recipes in the following format:\
Title, text description, text ingredient list (bullet), text recipe instruction (numbered)\
Title, embedded image, text description, text ingredient list (bullet), text recipe instruction (numbered)\
Title, embedded video, text description, text ingredient list (bullet), text recipe instruction (numbered)\
User may search for posts bases on post titles and ingredient lists.\
User may favorite other recipe posts and view them on a favorites page.\
Site will have a main page feed that will load 10 of the most recent posts initially. As the user scrolls to the bottom of the feed, 10 more posts will be displayed.\
\
Unique Features:\
User may rate any post once anonymously. Each post will display the average user rating on the main feed or on the recipe\'92s details page.\
Every recipe posted by a user will be viewable by other users on a page.\
\
------------------------------------------------------------------------------\
RUNNING THE WEB APPLICATION \
------------------------------------------------------------------------------\
To initiate the database and push sample data in project folder run:\
node tasks/seed.js\
\
To start router:\
Npm start\
}