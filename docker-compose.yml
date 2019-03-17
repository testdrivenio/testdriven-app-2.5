version: '3.7'

services:

  users:
    build:
      context: ./services/users
      dockerfile: Dockerfile
    volumes:
      - './services/users:/usr/src/app'
    ports:
      - 5001:5000
    environment:
      - FLASK_ENV=development
      - APP_SETTINGS=project.config.DevelopmentConfig
      - DATABASE_URL=postgres://postgres:postgres@users-db:5432/users_dev
      - DATABASE_TEST_URL=postgres://postgres:postgres@users-db:5432/users_test
    depends_on:
      - users-db

  users-db:
    build:
      context: ./services/users/project/db
      dockerfile: Dockerfile
    ports:
      - 5436:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres

  nginx:
    build:
      context: ./services/nginx
      dockerfile: Dockerfile
    restart: always
    ports:
      - 80:80
    depends_on:
      - users
