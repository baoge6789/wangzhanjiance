document.getElementById('monitorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默认提交行为

    const url = document.getElementById('url').value; // 获取输入的网址
    const name = document.getElementById('name').value; // 获取输入的网站名称

    // 将新网站添加到本地存储
    addWebsiteToList(url, name);
    displayWebsiteList();
});

document.getElementById('startMonitoring').addEventListener('click', async function() {
    const websites = JSON.parse(localStorage.getItem('websites')) || [];
    
    for (const website of websites) {
        const response = await fetch(`https://jiance.wangsir666998.workers.dev/?target=${encodeURIComponent(website.url)},${encodeURIComponent(website.name)}`);
        const resultText = await response.text();
        displayResult(website.name, resultText); // 显示结果时使用网站名称
    }
});

// 添加新网站到本地存储
function addWebsiteToList(url, name) {
   let websites = JSON.parse(localStorage.getItem('websites')) || [];
   websites.push({ url, name });
   localStorage.setItem('websites', JSON.stringify(websites));
}

// 显示当前监测的网站列表
function displayWebsiteList() {
   const websiteList = document.getElementById('websiteList');
   websiteList.innerHTML = ''; // 清空列表

   const websites = JSON.parse(localStorage.getItem('websites')) || [];
    
   websites.forEach((website, index) => {
       const listItem = document.createElement('li');
        
       // 创建链接并添加鼠标悬停效果
       const link = document.createElement('span');
       link.textContent = website.name; // 显示网站名称
       link.title = website.url; // 鼠标悬停时显示网址
       listItem.appendChild(link);

       // 创建修改按钮
       const editButton = document.createElement('button');
       editButton.textContent = '修改';
       editButton.className = 'modify';
       editButton.onclick = () => {
           modifyWebsite(index);
       };

       // 创建删除按钮
       const deleteButton = document.createElement('button');
       deleteButton.textContent = '删除';
       deleteButton.className = 'delete';
       deleteButton.onclick = () => {
           deleteWebsite(index);
       };

       // 将修改和删除按钮添加到列表项中，确保固定在行尾
       listItem.appendChild(editButton);
       listItem.appendChild(deleteButton);
        
       websiteList.appendChild(listItem);
   });
}

// 删除网站
function deleteWebsite(index) {
   let websites = JSON.parse(localStorage.getItem('websites')) || [];
   websites.splice(index, 1); // 删除指定索引的网站
   localStorage.setItem('websites', JSON.stringify(websites)); // 更新本地存储
   displayWebsiteList(); // 更新显示列表
}

// 修改网站
function modifyWebsite(index) {
   let websites = JSON.parse(localStorage.getItem('websites')) || [];
    
   const newUrl = prompt("请输入新的网址", websites[index].url);
   const newName = prompt("请输入新的网站名称", websites[index].name);
    
   if (newUrl && newName) {
       websites[index] = { url: newUrl, name: newName }; // 更新指定索引的网站信息
       localStorage.setItem('websites', JSON.stringify(websites)); // 更新本地存储
       displayWebsiteList(); // 更新显示列表
   }
}

// 显示检测结果
function displayResult(name, resultText) {
   const resultsDiv = document.getElementById('results');
    
   const resultElement = document.createElement('div');
    
   if (resultText.includes("正在运行")) { 
       resultText = `网站 ${name} 正常运行，状态码: 200`; // 修改结果文本格式 
       resultElement.className = 'status-normal'; 
   } else { 
       resultElement.className = 'status-error'; 
       resultElement.innerText = resultText; 
   }

   resultElement.innerText += ` (${resultText})`; 
   resultsDiv.appendChild(resultElement); 
}

// 页面加载时显示已保存的网站列表
window.onload = function() {
   displayWebsiteList();
};
