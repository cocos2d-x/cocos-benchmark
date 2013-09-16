#!/bin/sh
source config.sh

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
distr_files=(cocos2d.js main.js index.html submit.php errno.php rank.php update.php)
# DO NOT ADD the last '/'
distr_dirs=(res engines)
distr_lib_dirs=(lib/highcharts lib/jquery lib/phpbrowscap)
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

if [[ $compile_target = dev ]]; then
    if [[ $version != *dev* ]]; then
        echo "invalid dev version: $version"
        exit 1
    fi
fi

single_file_name=$project-v$version.js
single_file=$root_dir/$single_file_name
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

echo 'setting SINGLE_FILE...'
sed -i "" "s/SINGLE_FILE = false/SINGLE_FILE = true/g" cocos2d.js
check_error

echo 'compiling...'
ant $compile_target
if [ $? -ne 0 ]; then
    exit $?
fi
echo $single_file
if [ ! -f $single_file ]; then
	echo $single_file_name NOT found, check build.xml
	exit 1
else
	cp -fv $single_file $version_dir/
	check_error
	# delete the file after archived
	rm -f $single_file
fi

for file in ${distr_files[@]}; do
	cp -fv $file $version_dir/ 
	check_error
done

for dir in ${distr_dirs[@]}; do
	rsync -av --exclude=".*" $dir $version_dir/
	check_error
done

for dir in ${distr_lib_dirs[@]}; do
	rsync -av --exclude=".*" $dir $version_dir/lib/
	check_error
done

rsync -av --exclude=".*" $root_dir/Resources-html5/ $version_dir/

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

