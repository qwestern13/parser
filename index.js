const fs = require('fs');
const puppeteer = require('puppeteer');

(async() => {
        let flag = true;
        let res = [];
        let counter = 1;

    
        try {
            //В методе launch настройки отображения браузера
            const browser = await puppeteer.launch({
                headless: false,
                slowMo: 100,
                devtools: true
            });
    
            const page = await browser.newPage();
            await page.setViewport({
                width: 1400,
                height: 900
            });
    
            //Цикл ограничен 5 страницами
            while(counter < 5) {
                await page.goto(`https://www.kinopoisk.ru/top/navigator/order/rating/page/${counter}/#results`);
                await page.waitForSelector('li.arr');
                console.log(counter);

                let html = await page.evaluate(async () => {
                    let page = [];
                    try {
                        let divs = document.querySelectorAll('div._NO_HIGHLIGHT_');
                        console.log(divs);
                        divs.forEach(div => {
                            let a = div.querySelector('div.name');
    
                            let obj = {
                                title: a.innerText,
                                rating: div.querySelector('div.ratingGreenBG').innerText
                            }
                            page.push(obj);
                        })
    
                    }
    
                    catch(e) {
                        console.log(e)
                    }
    
                    return page
                }, {waitUntil: 'li.arr'})
                await res.push(html);


                console.log(res);
                counter++;
                
            }
            await browser.close();
            res = res.flat();
            //Записываем в файл
            fs.writeFile('films.json', JSON.stringify({'data': res}), err => {
                if(err) throw err;
                console.log('film.json saved');
                console.log('film.json length - ', res.length);
            });
        }
        catch(e){
            console.log(e)
        }
    
})();