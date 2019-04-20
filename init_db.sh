#!/bin/bash

# create
docker-compose exec exercises python manage.py recreate_db
docker-compose exec users python manage.py recreate_db
docker-compose exec scores python manage.py recreate_db
# seed
docker-compose exec exercises python manage.py seed_db
docker-compose exec users python manage.py seed_db
docker-compose exec scores python manage.py seed_db
