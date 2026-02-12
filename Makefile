# Docker commands for development

# builds the images without cache
# and starts the containers
# No logs will be printed using this command. 
# Would need to use `compose logs`.
build:
	docker compose -f docker-compose-dev.yaml build --no-cache
	docker compose -f docker-compose-dev.yaml up

build-d:
	docker compose -f docker-compose-dev.yaml build --no-cache
	docker compose -f docker-compose-dev.yaml up -d

# Runs the built images.
up:
	docker compose -f docker-compose-dev.yaml up

up-d:
	docker compose -f docker-compose-dev.yaml up -d

# Stops the built images.
down:
	docker compose -f docker-compose-dev.yaml down 


# Logs the output of a container in a seperate window.
# Ex Usage: make logs s=client
# -f: follows.
logs:
	docker compose -f docker-compose-dev.yaml logs -f $(s)

# -f: force
prune:
	docker system prune -f


# list volumes:
volumes:
	docker volume ls

# remove volume:
rm-volume:
	docker volume rm $(v)

prune-volumes:
	docker volume prune -f


# stops the docker compose and
# deletes all the containers and volumes.
clean:
	docker compose -f docker-compose-dev.yaml down -v
	docker system prune -f
	docker volume prune -f


# ===== Production Commands =====
build-prod:
	docker compose -f docker-compose.yaml build --no-cache
	docker compose -f docker-compose.yaml up

build-prod-d:
	docker compose -f docker-compose.yaml build --no-cache
	docker compose -f docker-compose.yaml up -d

up-prod:
	docker compose -f docker-compose.yaml up

up-prod-d:
	docker compose -f docker-compose.yaml up -d

down-prod:
	docker compose -f docker-compose.yaml down

clean-prod:
	docker compose -f docker-compose.yaml down -v
	docker system prune -f
	docker volume prune -f


# ===== Git Commands =====
fetch:
	git fetch origin $(b)


commit:
	git add .
	git commit -m "$(msg)"
	git push -u origin $(branch)

# /// OLD ///
# # Docker commands.

# # builds the images without cache
# # and starts the containers
# # No logs will be printed using this command. 
# # Would need to use `compose logs`.
# build:
# 	docker compose build --no-cache
# 	docker compose up

# build-d:
# 	docker compose build --no-cache
# 	docker compose up -d

# # Runs the built images.
# up:
# 	docker compose up

# up-d:
# 	docker compose up -d

# # Stops the built images.
# down:
# 	docker compose down 


# # Logs the output of a container in a seperate window.
# # Ex Usage: make compose logs <container_name>
# # $(filter-out $@,$(MAKECMDGOALS)) - Tells to filter everything and keep (MAKECMDGOALS)
# # Ex: make compose-logs client - filter client from cmd and pass it down.
# # -f: follows.
# logs:
# 	docker compose logs -f $(s)

# # -f: force
# prune:
# 	docker system prune -f


# # list volumes:
# volumes:
# 	docker volume ls

# # remove volume:
# rm-volume:
# 	docker volume rm $(v)

# prune-volumes:
# 	docker volume prune -f


# # stops the docker compose and
# # deletes all the containers and volumes.
# clean:
# 	docker compose down -v
# 	docker system prune -f
# 	docker volume prune -f


# # ===== Git Commands =====
# fetch:
# 	git fetch origin $(b)


# commit:
# 	git add .
# 	git commit -m "$(msg)"
# 	git push -u origin $(branch)
