const fs = require('fs')
const https = require('https')

var unzip;
const child_process = require('child_process');
var Old_Name;

if(!fs.exists('Magic')){
    Old_Name = 'Magic_old' + Date.now('year, month, day, hour, minute, second, millisecond').toString().split(' ').join('_');
    fs.rename('Magic',Old_Name,(err)=>{
        if( !err) {
            console.log('Started...')
            InstallerNpmPackages(()=>{
                download();
            })
        }else{
            console.log("Unable to rename directory... Check if the directory is open or being used somewhere! Close it and restart")

        }
        //download()    
    })
}else{
    InstallerNpmPackages(()=>{
        download();
    })
    // download();
}


function download(){
    unzip = require('unzip');
    var file = fs.createWriteStream("Magic.zip");
    console.log('Starting to download latest Code from Github!');
    https.get("https://codeload.github.com/Ankurrana/Magic/zip/master",(response)=>{
        response.pipe(file)
    
        response.on('end',()=>{
                console.info('File Download Complete!');
                
                file.on('close',()=>{
                    console.info('File closed for further usage')  
                    UnzipIt();                                 
                })

                file.on('finish',()=>{
                        file.close();
                        
                })    
        }) 
        response.on('error',(err)=>{
            fs.unlink(file)
            console.log('Error occured while downloading the file ' + JSON.stringify(err))
    }) })
}

function UnzipIt(){
    console.log('Unzipping the downloaded Zip!');
    fs.createReadStream("Magic.zip")
    .pipe(unzip.Extract({ path: '.' }))
    .on('close',()=>{
        console.log('Unzippping Complete');
         fs.rename('magic-master', 'Magic', function (err) {
            if (err) throw err;
            console.log('Renamed to Magic');
            MagicNpmPackages();
            
        });
    }) 
}

function MagicNpmPackages(){
    console.log('Starting to install npm packages!');
    var spawn = child_process.spawn;
    child = spawn("npm",['--prefix','./Magic','install','./Magic'],{stdio: 'inherit', shell: true});
    child.on('close',()=>{
        console.log('npm install called!');
        CopyOldOverrideFiles()
    })
}

function CopyOldOverrideFiles(){
    if(Old_Name){
        if( fs.existsSync(Old_Name + '/overrideAppData.json')){
          fs.createReadStream(Old_Name + '/overrideAppData.json')
          .pipe(fs.createWriteStream('Magic/overrideAppData.json'))
          .on('close',()=>{
            if(fs.existsSync(Old_Name + '/overrideConfig.json')){
                fs.createReadStream(Old_Name + '/overrideConfig.json')
                .pipe(fs.createWriteStream('Magic/overrideConfig.json'))
                .on('close',()=>{
                    Clean();    
                }) 
            }
            
          })
        }
    }else{
            console.log('No Old Override Files exists');
    }
}


function InstallerNpmPackages(cb){
    console.log('Starting to install MagicInstallers npm packages!');
    var spawn = child_process.spawn;
    child = spawn("npm",['install'],{stdio: 'inherit', shell: true});
    child.on('close',()=>{
        console.log('npm install called!');
        cb();
    })

}

function Clean(){
    fs.unlinkSync('./Magic.zip');
    if(Old_Name)
        deleteFolderRecursive(Old_Name); 
    console.log('Clean Command Complete!');          
}


function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
