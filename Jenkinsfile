
pipeline {
    options {
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '30'))
    }
    agent any 
    stages {
        stage('Build') { 
            steps {
                echo "Build stage"
                sh 'chmod +x buildScripts/build.sh'
                sh('buildScripts/build.sh')
            }
        }
        stage('Test') { 
            steps {
                echo "Test"
            }
        }
        stage('Deploy') { 
            steps {
                echo "Deploy"
                sh 'chmod +x buildScripts/deploy.sh'
                sh('buildScripts/deploy.sh')
            }
        }
    }
}