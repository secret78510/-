let url = 'https://opendata.epa.gov.tw/api/v1/AQI?%24skip=0&%24top=1000&%24format=json';
fetch(url).then((response) => {
    console.log(response);
    return response.json();
}).then((jsonData) => {
    recode(jsonData);
    select(jsonData);
}).then(()=>{
    loader.style.display ='none';
}).catch((err) => {
    console.log('錯誤', err);
})

const quality = [
    {
        Status: '良好',
        color: '#95F084'
    },
    {
        Status: '普通',
        color: '#FFE695'
    },
    {
        Status: '對敏感族群不健康',
        color: '#FFAF6A'
    }, {
        Status: '對所有族群不健康',
        color: '#FF5757'
    },
    {
        Status: '非常不健康',
        color: '#9777FF'
    },
    {
        Status: '危害',
        color: '#AD1774'
    },
    {
        Status: '設備維護',
        color: 'red'
    }
]
//指定DOM
let area = document.querySelector('.area');
let list = document.querySelector('.list');
let region = document.querySelector('.region');
let airQuality = document.querySelector('.airQuality');
let place = document.querySelector('.place');
let index = document.querySelector('.index');
let left = document.querySelector('.left');
let leftHeader = document.querySelector('.left-header');
let loader = document.querySelector('.loader');
let time = document.querySelector('.time');
//監聽
area.addEventListener('change', updateList);


//紀錄api資料
let recodeArr = [];
function recode(jsonData) {
    for (let i = 0; i < jsonData.length; i++) {
        recodeArr.push(jsonData[i])
    }
}
console.log(recodeArr);
//下拉選單
function select(jsonData) {
    let arrlist = [];
    for (let i = 0; i < jsonData.length; i++) {
        arrlist.push(jsonData[i].County)
    }
    let arr = [];
    //過濾重複地區名稱
    arrlist.forEach(item => {
        if (arr.indexOf(item) === -1) {
            arr.push(item)
        }
    })
    for (let i = 0; i < arr.length; i++) {
        let option = document.createElement('option');
        option.textContent += arr[i];
        area.appendChild(option);
    }
}
//更新右邊畫面
function updateList(e) {
    let str = '';
    let zone= '';
    //將內容排序
    let arr = recodeArr.sort((a, b) => {
        let x = a.AQI;
        let y = b.AQI;
        return x - y;
    })
    //再迭代
    arr.forEach((el) => {
        //上色
        let colorList = quality.find(item => {
            return item.Status === el.Status
        })
        console.log(colorList)
        //遇到設備維護時
        if(el.AQI ===''){
            el.AQI = '維護';
        }
        //目標內容相等加入
        if (e.target.value === el.County) {
            str += `<div class="right col-5 row">
            <a href="#" class="place" onclick="updataDetail(this)">${el.SiteName}</a>
            <div class="color" style="background-color:${colorList.color}">${el.AQI}</div>
            </div>`
        }
    })
    list.innerHTML = str;

    //將觸發select後的第一個地址參數 加入左邊畫面的參數內容
    let location = recodeArr.find(item =>{
        return e.target.value === item.County
    })
    if(location){
        return updataDetail(location.SiteName)
    }
}
//更新畫面
function updataDetail(e) {
    event.preventDefault();
    let str = '';
    let zone='';
    console.log(e);
    //標題
    //不是點擊A的標籤內容 就是點選select裡第一個出現的地址value
    region.textContent = e.textContent || e ;
    recodeArr.forEach( item =>{
        //不是選單的內容 就是滑鼠點擊右邊的內容
        if(item.SiteName === e || item.SiteName ===e.textContent ){
            obj ={
                AQI:item.AQI,
                O3:item.O3,
                PM10:item.PM10,
                'PM2.5':item['PM2.5'],
                CO:item.CO,
                SO2:item.SO2,
                NO2:item.NO2,
                item:item.Status,
                PublishTime:item.PublishTime,
                SiteName:item.SiteName
            }
            //更新時間
            zone += `<div>
            <span style="font-size:30px">${obj.SiteName}</span>
            <span>${obj.PublishTime} 更新</span>
            </div>`;
            //標題旁邊的指數
            index.textContent = obj.AQI;
            //上色
            let colorList = quality.find(el=>{
                return item.Status == el.Status
            })              
            index.style.backgroundColor = colorList.color; 
            //字串內容     
            str += `<li>臭氧<small>O3(ppb)</small><sapn>${obj.O3}</sapn></li>
            <li>懸浮微粒<small>PM10(μg/m3)</small><sapn>${obj.PM10}</sapn></li>
            <li>細懸浮微粒<small>PM2.5(μg/m3)</small><sapn>${obj['PM2.5']}</sapn></li>
            <li>一氧化碳<small>CO(ppm)</small><sapn>${obj.CO}</sapn></li>
            <li>二氧化硫<small>SO2(ppb)</small><sapn>${obj.SO2}</sapn></li>
            <li>二氧化氮<small>NO2(ppb))</small><sapn>${obj.NO2}</sapn></li>
            `
        }
    })
    //更新時間
    time.innerHTML =zone;
    //左邊標題
    airQuality.innerHTML = str;
    //確定讀取到 顯示border的外框
    left.style.border= '3px solid #000000';
    leftHeader.style.borderBottom='3px solid #000';
    index.style.borderLeft='3px solid #000000';
}



//更新畫面迴圈寫法
// for(let i =0 ;i<recodeArr.length;i++){
//     let colorList = quality.find(item=>{
//         if(item.Status == recodeArr[i].Status){
//             return item;
//         }
//     })
//     recodeArr.sort((a,b)=>{
//         let a = a.AQI;
//         let b = b.AQI;
//         return a-b;
//     })
//     if(e.target.value == recodeArr[i].County){
//         str += `<div class="right col-5 row">
//         <a href="#" >${recodeArr[i].SiteName}</a>
//         <div class="color" style="background-color:${colorList.color}">${recodeArr[i].AQI}</div></div>`
//     }
// }
// list.innerHTML =str;

