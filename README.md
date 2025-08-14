# Docker Practice Main

A comprehensive collection of Docker practice exercises and examples to help you master containerization concepts.

## 🐳 What is This?

This repository contains various Docker practice scenarios, from basic container operations to advanced orchestration techniques. It's designed for developers who want to improve their Docker skills through hands-on practice.

## 📚 Practice Exercises

### 1. Basic Container Operations
- **Container Lifecycle**: Create, start, stop, and remove containers
- **Image Management**: Pull, build, tag, and push Docker images
- **Port Mapping**: Expose and map container ports to host
- **Volume Mounting**: Persist data between container and host

### 2. Multi-Container Applications
- **Docker Compose**: Orchestrate multiple services
- **Networking**: Connect containers using Docker networks
- **Service Discovery**: Implement inter-service communication
- **Load Balancing**: Distribute traffic across multiple instances

### 3. Advanced Concepts
- **Multi-stage Builds**: Optimize image size and build process
- **Health Checks**: Monitor container health and restart policies
- **Resource Limits**: Control CPU and memory usage
- **Security**: Implement best practices for container security

## 🚀 Getting Started

### Prerequisites
- Docker Desktop installed and running
- Basic understanding of command line operations
- Git for cloning the repository

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd docker_practice-main

# Verify Docker installation
docker --version
docker-compose --version
```

## 🏗️ Project Structure

```
docker_practice-main/
├── exercises/           # Practice exercise files
├── examples/            # Working examples and solutions
├── challenges/          # Advanced challenges
├── dockerfiles/         # Sample Dockerfiles
├── compose-files/       # Docker Compose examples
└── docs/               # Documentation and guides
```

## 📖 Exercise Examples

### Exercise 1: Basic Container
```bash
# Pull an image
docker pull nginx:alpine

# Run a container
docker run -d -p 8080:80 --name my-nginx nginx:alpine

# Check container status
docker ps

# View container logs
docker logs my-nginx

# Stop and remove container
docker stop my-nginx
docker rm my-nginx
```

### Exercise 2: Custom Image Build
```bash
# Build from Dockerfile
docker build -t my-app:v1 .

# Run custom image
docker run -d -p 3000:3000 my-app:v1

# Tag for registry
docker tag my-app:v1 username/my-app:latest
```

### Exercise 3: Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
```

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🎯 Practice Challenges

### Beginner Level
1. **Hello World Container**: Create a simple container that prints "Hello, Docker!"
2. **Web Server**: Run a web server and access it from your browser
3. **Data Persistence**: Create a container with persistent data storage

### Intermediate Level
1. **Multi-Service App**: Build a simple web app with database using Docker Compose
2. **Custom Base Image**: Create a custom base image with your preferred tools
3. **Network Isolation**: Set up isolated networks for different application tiers

### Advanced Level
1. **Multi-Architecture Builds**: Build images for multiple CPU architectures
2. **Security Scanning**: Implement security scanning in your CI/CD pipeline
3. **Performance Optimization**: Optimize container performance and resource usage

## 🔧 Useful Commands

### Container Management
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Execute command in running container
docker exec -it container_name bash

# Copy files to/from container
docker cp container_name:/path/to/file ./local/path
```

### Image Management
```bash
# List images
docker images

# Remove unused images
docker image prune

# Build with no cache
docker build --no-cache -t image_name .

# Save/load images
docker save image_name > image.tar
docker load < image.tar
```

### System Management
```bash
# System information
docker system df
docker system info

# Clean up unused resources
docker system prune -a

# View Docker daemon logs
docker system events
```

## 📚 Learning Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the [Issues](https://github.com/username/docker_practice-main/issues) page
- Create a new issue with detailed description
- Join our community discussions

## 🎉 Acknowledgments

- Docker community for excellent documentation
- Contributors who share their knowledge and experience
- Open source projects that make learning Docker easier

---

**Happy Docker Learning! 🐳✨**
