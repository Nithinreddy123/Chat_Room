

def app_ver
pipeline {
  agent any
  stages {
   
    stage('Build Image'){
        steps{
             script {
        def pkg = readJSON file: 'package.json'
         app_ver  = pkg.version 
             }
sh "docker build -t 9502044626/chat-room-widget:$app_ver ."
        }
        
    }
}
}
