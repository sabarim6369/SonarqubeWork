docker run -d --name sonarqube \
  -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:latest


or 


docker run -d --name sonarqube -p 9000:9000 -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true sonarqube:latest


🔹 3. Open SonarQube Dashboard
Once the container is up, open:


http://localhost:9000
Default credentials:
Username: admin
Password: admin





✅ Example: Scan a Node.js/React/Java Project
Create a file in your project root:

sonar-project.properties


sonar.projectKey=myproject
sonar.projectName=My Project
sonar.sources=src
sonar.host.url=http://localhost:9000
sonar.login=<your-generated-token>



Run Scanner:

npx sonar-scanner

🔄 To Stop SonarQube

docker stop sonarqube
docker rm sonarqube
