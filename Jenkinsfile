pipeline {
  agent any
  stages {
    stage('Pull SCM'){
        git url:'https://github.com/Nithinreddy123/Chat_Room.git',
        branch:'master'
        
    }
    stage('Build Image'){
        sh 'docker build -t 9502044626/chat-room-widget:jenkins .'
    }
}
}
