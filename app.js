const DNA_MAPPING={ '00':'A','01':'T','10':'G','11':'C' };
const REVERSE_DNA_MAPPING={ 'A':'00','T':'01','G':'10','C':'11' };

function handleEncodeFile(file){
 const reader=new FileReader();
 reader.onload=e=>{
  const data=new Uint8Array(e.target.result);
  let dnaSequence='';
  for(let i=0;i<data.length;i++){
   let byte=data[i];
   for(let j=0;j<4;j++){
    const bits=((byte>>(6-j*2))&3).toString(2).padStart(2,'0');
    dnaSequence+=DNA_MAPPING[bits];
   }
  }
  currentEncodedFile={data:dnaSequence,filename:file.name+'.dna'};
  simulateEncodingUI(dnaSequence);
  reader.readAsArrayBuffer(file);
 };
 reader.readAsArrayBuffer(file);
}

function handleDecodeFile(file){
 const reader=new FileReader();
 reader.onload=e=>{
  const dna=e.target.result.trim();
  let bytes=[];
  for(let i=0;i<dna.length;i+=4){
   let byte=0;
   for(let j=0;j<4;j++){
    const bits=REVERSE_DNA_MAPPING[dna[i+j]];
    byte=(byte<<2)|parseInt(bits,2);
   }
   bytes.push(byte);
  }
  currentDecodedFile=new Uint8Array(bytes);
  downloadDecoded(file.name.replace('.dna','_decoded'));
 };
 reader.readAsText(file);
}

function showProcessModal(){ document.getElementById('processModal').classList.add('active'); }
function closeProcessModal(){ document.getElementById('processModal').classList.remove('active'); }

async function simulateEncodingUI(dnaSequence){
 showProcessModal();
 const start=Date.now();
 const fill=document.getElementById('progressFill');
 const percent=document.getElementById('progressPercent');
 const preview=document.getElementById('dnaPreview');
 const count=document.getElementById('basesCount');
 const time=document.getElementById('processTime');
 const stages=['stage1','stage2','stage3'];

 for(let i=0;i<=100;i+=10){
  fill.style.width=i+'%';
  percent.textContent=i+'%';
  count.textContent=Math.floor((dnaSequence.length*i)/100);
  preview.textContent=dnaSequence.slice(0,Math.max(20,Math.floor((dnaSequence.length*i)/100))).slice(0,400);
  time.textContent=((Date.now()-start)/1000).toFixed(1)+'s';

  if(i<40) document.getElementById(stages[0]).classList.add('active');
  else if(i<80){
   document.getElementById(stages[0]).classList.remove('active');
   document.getElementById(stages[0]).classList.add('completed');
   document.getElementById(stages[1]).classList.add('active');
  } else {
   document.getElementById(stages[1]).classList.remove('active');
   document.getElementById(stages[1]).classList.add('completed');
   document.getElementById(stages[2]).classList.add('active');
  }
  await new Promise(r=>setTimeout(r,180));
 }
}

function downloadEncoded(){
 const blob=new Blob([currentEncodedFile.data],{type:'text/plain'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download=currentEncodedFile.filename;
 a.click();
}

function downloadDecoded(filename){
 const blob=new Blob([currentDecodedFile]);
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download=filename;
 a.click();
}