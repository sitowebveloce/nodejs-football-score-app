// Import packages
import express from 'express';
import colors from 'colors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import {once} from 'events';
import multer from 'multer';


// Declare APP
const app = express();
// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Dirname
const __dirname = dirname(fileURLToPath(import.meta.url)); 
// Public folder
app.use(express.static(__dirname + '/public'));

// MULTER FILE UPLOAD SETTINGS
// SET STORAGE
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.dat')
    }
  });
// CHECK FILE EXT
  let upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if(ext !== '.txt' && ext !== '.dat') {
            return callback('Only txt and .dat are allowed')
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
});

//*** READ FILE LINES FN */
async function processLineByLine(file) {
    try {
    // Count
    let count = 1;
    // Empty Array
    let arrTeam = [];
    // Is data valid
    let isDataValid = false;

    const rl = readline.createInterface({
        input: fs.createReadStream(`./upload/${file}`),
        crlfDelay: Infinity
      });
      // On event
      rl.on('line', (line) => {
        // Check if data format is valid
       if(line.substring(7,23).trim() == 'Team' && count === 1){
        // console.log(line.substring(7,23).trim());
        isDataValid = true;
        }
            if(isDataValid && count != 1 && count != 19){
                //  console.log(`Line ${count}, Team: ${line.substring(7,22).trim()}, Col F: ${line.substring(43,45)}, Col A: ${line.substring(50,53)}, Diff: Col A: ${parseInt(line.substring(43,45).trim()) - parseInt(line.substring(50,53).trim())}`);
                // Push
        
                arrTeam.push({
                    id: count, 
                    team: line.substring(7,23).trim(), 
                    f:line.substring(43,45).trim(),
                    a:line.substring(50,53).trim(),
                    diff:(parseInt(line.substring(43,45).trim()) - parseInt(line.substring(50,53).trim()))
                    });
            };
          // Increment
          count++;   
    });
  
    await once(rl, 'close');
  
    console.log('File processed...');
    isDataValid = false;
    // Sort
    let sorted = arrTeam.sort((a, b)=>{
        return b.diff - a.diff
    });
    // Return data sorted
    if(sorted) return sorted;
    
} catch (err) {
      console.error(err);
      return err.message;
    }
  };

//*** API ROUTES
// Default Data File
let dataFile = 'football_.dat';
let dataRes;

app.get('/api/get', async (req, res)=>{    
    dataRes = await processLineByLine(dataFile);
    // Responde
    if(dataRes.length > 0){
        res.status(200).json({message:'Success', data: dataRes});
    }else{
        res.status(404).json({message:'Not found', data:[]});
    }
    // Reset 
    dataFile = 'football_.dat';
});

//*** UPLOAD
app.post('/upload',  upload.single('myFile'), async (req, res) =>{
   const file = req.file
   // console.log(file)
   if (!file) {
    const error = new Error('Please upload a file')
    res.sendStatus(error);
   }
   if(file){
    // console.log(file.filename);
    dataFile = file.filename;
    // Responde
    if(dataRes !== undefined){
        res.redirect('/');
    }else{
        res.status(404).json({message:'Not found'});
    }
   }
});

// HOME ROUTE 
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

// 404 redirect
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.redirect('/');
});

// Server Listener
const PORT = process.env.PORT || 3013;
app.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`.america));