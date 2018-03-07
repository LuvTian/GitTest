# GitTest
测试学习github的使用
1、文件在工作区的修改全部撤销（让这个文件回到最近一次git commit或git add）：git checkout -- file
2、可以把暂存区的修改撤销掉（unstage），重新放回工作区：git reset HEAD file
3、版本库信息单行显示：git log --pretty=oneline
4、历史操作命令，常用于查找版本库信息回退：git reflog
5、版本库HEAD指针指向：git reset --head HEAD^(将HEAD指针指向上一个版本&HEAD~100)
6、通过commit_id,快速将HEAD指针指向该版本：git reset --hard commit_id
7、比较工作区文件与版本库文件的区别：git diff HEAD -- file
8、本地git仓库提交到远程：git remote add origin 远程git的url
9、第一次推送master分支的所有内容；git push -u origin master ; 此后，每次本地提交后，只要有必要，就可以使用命令:git push origin master
10、删除分支：git branch -d 分支名
11、查看分支的合并情况：$ git log --graph --pretty=oneline --abbrev-commit