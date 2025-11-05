pipeline {
    agent any  // 在任意可用的 Jenkins 节点上运行

    // environment {
    //     // 定义环境变量（可以在这里放密钥、配置等）
    //     // MY_ENV = "value"
    // }

    stages {

        stage('Checkout') {
            steps {
                echo '🚀 拉取仓库代码...'
                // 如果你配置了 Git 参数，也可以直接这样写
                git branch: 'master', url: 'https://github.com/WangsanAndWangcai/BlindCubeMemory.git'
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ 开始构建项目...'
                sh '''
                    # 这里根据你的项目类型修改命令
                    npm install
                    npm run build
                '''
            }
        }

        stage('Test') {
            steps {
                echo '🧪 运行测试...Pass'
                // sh '''
                //     # 可选：如果有测试命令
                // '''
            }
        }

        stage('Deploy') {
            when {
                expression { env.GIT_BRANCH?.endsWith('master') }
            }

            steps {
                echo '🚢 开始部署...Pass'
                sh '''
                    /home/admin/0_PATH/deploy_cube.sh
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 构建成功！'
        }
        failure {
            echo '❌ 构建失败，请检查日志。'
        }
    }
}
