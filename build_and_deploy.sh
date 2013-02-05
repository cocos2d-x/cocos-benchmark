#!/bin/sh
upload_server=
upload_user=
upload_dir=
if [ ! $upload_server ]; then
    echo 'upload_server not assigned'
    exit 1
fi
if [ ! $upload_user ]; then
    echo 'upload_user not assigned'
    exit 1
fi
if [ ! $upload_dir ]; then
    echo 'upload_dir not assigned'
    exit 1
fi

project=cocos-benchmark
distr_files=(cocos2d.js main.js index.html)
distr_dirs=(res)
root_dir=$(pwd)
archive_dir=$(pwd)/archive
usage() 
{
	echo "Usage: $0 version"
	exit 1
}
check_error() 
{
	result=$?
	if [ $result -ne 0 ]; then
		echo error occurred, exit: $result
		exit $result
	fi
}
create_dir() 
{
	echo create_dir $1
	if [ ! -d $1 ]; then
		mkdir $1
		check_error;
	fi
}
if [ $# -lt 1 ]; then
	usage
fi
version=$1
all_in_one_name=$project-v$version.js
all_in_one=$root_dir/$all_in_one_name
version_dir=$archive_dir/v$version
tar_file_name=$project-v$version.tar.gz
tar_file=$archive_dir/$tar_file_name
create_version_dir()
{
        create_dir $archive_dir
        create_dir $version_dir
}
echo 'start'
create_version_dir

echo 'setting ALL_IN_ONE...'
sed -i "" "s/ALL_IN_ONE = false/ALL_IN_ONE = true/g" cocos2d.js
check_error

echo 'compiling...'
ant
if [ $? -ne 0 ]; then
    exit $?
fi
echo $all_in_one
if [ ! -f $all_in_one ]; then
	echo $all_in_one_name NOT found, check build.xml
	exit 1
else
	cp -fv $all_in_one $version_dir/
	check_error
fi
for file in ${distr_files[@]}; do
	cp -fv $file $version_dir/ 
	check_error
done
for dir in ${distr_dirs[@]}; do
	rsync -av --exclude=".*" $dir $version_dir/
	check_error
done
cd $version_dir
echo "removing hidden file(s)..."
rm -rf .DS_Store

echo packaging...
tar -zcf $tar_file *

echo uploading...
scp $tar_file $upload_user@$upload_server:$upload_dir/

echo deploying...
deploy_cmd="cd $upload_dir; rm -rf `ls | grep -v .tar.gz`; tar -xvf $tar_file_name; ls"
ssh $upload_user@$upload_server $deploy_cmd

