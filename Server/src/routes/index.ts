/*
 - routes 폴더의 여러 라우터 파일들을 모아서 한꺼번에 내보내기 위한 파일
*/

import authRouter from './authRouter';
import imageRouter from './imageRouter'
import weatherRouter from './weatherRouter'
import sigunguRouter from './sigunguRouter'
import tourRouter from './tourRouter'
import densenetRouter from './densenetRouter'
import scratchMapRouter from './scratchMapRouter'
import combinedRouter from './combinedRouter'
import plannerMarketRouter  from './plannerMarketRouter'
import travelPlanRouter  from './travelPlanRouter'
import myPageRouter  from './myPageRouter'
import userRouter  from './userRouter'





export { 
    authRouter, 
    imageRouter ,
    weatherRouter, 
    sigunguRouter , 
    tourRouter, 
    densenetRouter, 
    scratchMapRouter,
    combinedRouter,
    plannerMarketRouter ,
    travelPlanRouter,
    myPageRouter,
    userRouter
};

//라우터를 하나 새로만들고 모두 등록 후 app.ts에서는 하나로 app.use('/api', ~~~ ) 요런식으로
//map stk ? sdk 
