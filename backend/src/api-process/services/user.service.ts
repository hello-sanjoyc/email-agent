import { fetchAiResponseToneByIDRes, fetchAiServiceByIDRes, PriorityUpdate } from "../controllers/v1/types";
import db from "../../db"
import { AIResponseTone, Prisma } from "../../generated/prisma";
import AppError from "../utils/appError.utils";
import { LinkAccountResponse } from "./link-account/types";
import { LinkCalendarAccountResponse } from "./link-calendar-account/types";
import { EmailAccountData,FetchAIServiceDatasetEach,FetchAIToneDatasetEach,GenerateStatsResponse, UserData, UserDataByEmail, UserProfileData } from "./types";

export const getAccounts = async (userId:string)=> {
    try{
        const accounts =await db.emailAccount.findMany({
            where:{userId},
            select:{
                id:true,
                emailAddress:true,
                isActive:true,
                provider:true,
                priorityWeight:true,
                createdAt:true,
                deletedAt:true
            }
        });
        if(accounts.length === 0) throw new AppError('no profiles found',404);
        const accountData = accounts.map(function(account){
            return {
                id:account.id,
                email:account.emailAddress,
                isActive:account.isActive,
                provider:account.provider,
                priority:account.priorityWeight,
                createdAt:account.createdAt
            }
        });
        return accountData;
    }catch(err){
        throw err;
    }
}
export const createEmailAccount = async (providerResponse:LinkAccountResponse,userId:string):Promise<boolean> => {
    try{
        return await db.$transaction(async(tx)=>{
            const existingEmailAccounts =await tx.emailAccount.findMany();
            const isAccountWithSameMail = existingEmailAccounts.some((each)=>each.emailAddress === providerResponse.email);
            if(isAccountWithSameMail) throw new AppError('Email account already exists',409);
            await tx.emailAccount.create({
                data:{
                    emailAddress:providerResponse.email,
                    accessToken:providerResponse.accessToken,
                    refreshToken:providerResponse.refreshToken,
                    appPassword:providerResponse.password,
                    imapHost:providerResponse.imap_host,
                    imapPort:providerResponse.imap_port,
                    smtpHost:providerResponse.smtp_host,
                    smtpPort:providerResponse.smtp_port,
                    provider:providerResponse.provider,
                    userId,
                    isActive:true,
                    priorityWeight:existingEmailAccounts.length === 0?100:0
                }            
            });
            return true;
        });        
    }catch(err){
        throw err;
    }
}
//it returns updated account status in boolean
export const toggleEmailAccountStatus = async (emailAccountId:string):Promise<boolean> => {
    try{
        return db.$transaction(async (tx)=>{
            const existingEmailAccountData = await db.emailAccount.findFirst({
                where:{id:emailAccountId},
                select:{
                    isActive:true
                }
            });
            if(!existingEmailAccountData) throw new AppError('Invalid email account',400);
            await db.emailAccount.update({
                data:{
                    isActive:!existingEmailAccountData.isActive
                },
                where:{
                    id:emailAccountId
                }
            });
            return !existingEmailAccountData.isActive;    
        });
    }catch(err){
        throw err;
    }
}
export const getUserProfile = async (userId:string):Promise<UserProfileData>=>{
    try{
        const profile = await db.user.findUnique({
            where:{id:userId},
            select:{
                id:true,
                name:true,
                email:true,
                phone:true,
                isActive:true,
                isAutomationActive:true,
                aiResponseTone:true,
                aiServiceName:true,
                lastAutomationRanAt:true,
                createdAt:true,
                subscriptions:{
                    where:{isActive:true},
                    select:{
                        id:true,
                        startDate:true,
                        endDate:true,
                        isActive:true,
                        plan:true
                    }
                }
            }
        });
        if(!profile) throw new AppError('no profile found',404);
        return profile;
    }catch(err){
        throw err;
    }
}
export const createCalendarAccount = async (providerResponse:LinkCalendarAccountResponse,userId:string):Promise<boolean> => {
    try{
        return db.$transaction(async (tx) => {
            const existingCalendarAccount = await tx.calendarAccount.findFirst(
                {where:{
                    emailAddress:providerResponse.email
                }}
            );
            if(existingCalendarAccount) throw new AppError('calendar account already exists',409);
            await tx.calendarAccount.create({
                data:{
                    userId,
                    emailAddress:providerResponse.email,
                    accessToken:providerResponse.accessToken,
                    refreshToken:providerResponse.refreshToken,
                    provider: providerResponse.provider,
                    isActive:true                   
                }
            });
            return true;
        });
    }catch(err){
        throw err;
    }
}
export const getCalendarAccounts = async (userId:string)=> {
    try{
        const accounts =await db.calendarAccount.findMany({
            where:{userId},
            select:{
                id:true,
                emailAddress:true,
                isActive:true,
                provider:true,
                createdAt:true,
                deletedAt:true
            }
        });
        if(accounts.length === 0) throw new AppError('No calendar accounts found',404);
        const accountData = accounts.map(function(account){
            return {
                id:account.id,
                email:account.emailAddress,
                isActive:account.isActive,
                provider:account.provider,
                createdAt:account.createdAt
            }
        });
        return accountData;
    }catch(err){
        throw err;
    }
}
//it returns updated account status in boolean
export const toggleCalendarAccountState = async (calendarAccountId:string):Promise<boolean> => {
    try{
        return db.$transaction(async (tx)=>{
            const existingCalendarAccountData = await db.calendarAccount.findFirst({
                where:{id:calendarAccountId},
                select:{
                    isActive:true
                }
            });
            if(!existingCalendarAccountData) throw new AppError('Invalid calendar account',400);
            await db.calendarAccount.update({
                data:{
                    isActive:!existingCalendarAccountData.isActive
                },
                where:{
                    id:calendarAccountId
                }
            });
            return !existingCalendarAccountData.isActive;    
        });
    }catch(err){
        throw err;
    }
}
export const fetchEmailAccount = async (accountId:string):Promise<EmailAccountData> => {
    try{
        const emailAccountData = await db.emailAccount.findFirst({where:{id:accountId}});
        if(!emailAccountData) throw new AppError('No existing email account found',404);
        return emailAccountData;
    }catch(err){
        throw err;
    }
}
export const createCalendarAccFormEmailAcc = async (emailAccountData:EmailAccountData):Promise<boolean> => {
    try{
       await db.calendarAccount.create(
        {
            data:{
                userId:emailAccountData.userId,
                emailAddress:emailAccountData.emailAddress,
                accessToken:emailAccountData.accessToken,
                refreshToken:emailAccountData.refreshToken,
                provider:emailAccountData.provider,
                isActive:true
            }
        }
       ); 
       return true;
    }catch(err){
        throw err;
    }
}
//to fetch a user's data using its id
export const fetchUserData = async (userId:string):Promise<UserData> => {
    try{
        const userData = await db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                id:true,
                name:true,
                email:true,
                phone:true
            }
        });
        if(!userData) throw new AppError('no user found',404);
        return userData;
    }catch(err){
        throw err;
    }
}
//update user with name, email and phone
export const updateUser = async (id:string,name:string, email:string,phone:string|undefined):Promise<boolean> => {
    try{
        await db.user.update({
            where:{id},
            data:{name,email,phone}
        });
        return true;    
    }catch(err){
        throw err;
    }
}
//change the ai response tone for a certain profile
export const changeProfileAIResponseTone = async (id:string,tone:AIResponseTone):Promise<boolean> => {
    try{
        await db.user.update({
            where:{
                id
            },
            data:{
                aiResponseTone:tone
            }
        });
        return true;
    }catch(err){
        throw err;
    }
}
export const updateProfileAutomationStatus = async (id:string):Promise<boolean> => {
    try{
        return await db.$transaction(async(tx)=>{
            const existingUser =await tx.user.findFirst({
                where:{id}
            });
            if(!existingUser) throw new AppError('User not found',404);
            await tx.user.update({
                where:{id},
                data:{isAutomationActive:!existingUser.isAutomationActive}
            });
            return !existingUser.isAutomationActive;
        });
    }catch(err){
        throw err;
    }
}
//get user by email
export const fetchUserByEmail = async (email:string):Promise<UserDataByEmail>=> {
    try{
        const userData = await db.user.findFirst({
            where:{email},
            select:{
                id:true,
                name:true,
                email:true
            }
        });
        if(!userData) throw new AppError('User not found',404);
        return userData;
    }catch(err){
        throw err;
    }
}
//update email accounts priority
export const updateEmailAccountPriorityWeight = async (idWithPriority:PriorityUpdate[],userId:string) => {
    try{
        // add this log
        console.log('idWithPriority:', JSON.stringify(idWithPriority));
        console.log('priority types:', idWithPriority.map(e => ({ val: e.priority, type: typeof e.priority })));
        const caseFragments = idWithPriority.map((each)=>{
            return Prisma.sql`WHEN id=${each.id} THEN ${Number(each.priority)}::int`
        });
        const ids = idWithPriority.map((each)=>{
            return each.id;
        });
        await db.$executeRaw`
        UPDATE email_accounts
        SET priority_weight = CASE
        ${Prisma.join(caseFragments,'\n')}
        END
        WHERE id IN (${Prisma.join(ids)})
        AND user_id = ${userId}
        `;
        return true;
    }catch(err){
        throw err;
    }
}
//delete email account
export const softOrHardDeleteEmailAccount = async (userId:string,emailAccId:string):Promise<boolean> => {
    try{
        const response = await db.$transaction(async (tx)=>{
            const emailAcc = await tx.emailAccount.findFirst({
                where:{
                    id:emailAccId,
                    userId
                }
            });
            if(!emailAcc) throw new AppError('No email account found to delete',404);
            const activityCount = await tx.emailActivity.count({
                where:{emailAccountId:emailAccId,userId}
            });
            if(activityCount > 0){
                await tx.emailAccount.delete({
                    where:{id:emailAccId}
                });                
            }else{
                await tx.emailAccount.update({
                    where:{id:emailAccId},
                    data:{
                        deletedAt:new Date()
                    }
                });
            }
            return true;
        });
        return response;
    }catch(err){
        throw err;
    }
}
//delete email account
export const softOrHardDeleteCalendarAccount = async (userId:string,calendarAccId:string):Promise<boolean> => {
    try{
        const response = await db.$transaction(async (tx)=>{
            const calendarAcc = await tx.calendarAccount.findFirst({
                where:{
                    id:calendarAccId,
                    userId
                }
            });
            if(!calendarAcc) throw new AppError('No calendar account found to delete',404);
            const activityCount = await tx.emailActivity.count({
                where:{calendarAccountId:calendarAccId,userId}
            });
            if(activityCount > 0){
                await tx.calendarAccount.delete({
                    where:{id:calendarAccId}
                });                
            }else{
                await tx.calendarAccount.update({
                    where:{id:calendarAccId},
                    data:{
                        deletedAt:new Date()
                    }
                });
            }
            return true;
        });
        return response;
    }catch(err){
        throw err;
    }
}
//fetch ai tone dataset
export const fetchAIToneDataset = async (userId:string):Promise<FetchAIToneDatasetEach[]> => {
    try{
        const dbData = await db.$transaction(async (tx)=>{
            const tones = await tx.aITone.findMany({
                where:{
                    isActive:true
                },
                select:{
                    id:true,
                    tone:true,
                    label:true
                }
            });
            if(tones.length === 0) throw new AppError('AI response tones not available',404);
            const userData = await tx.user.findUnique({
                where:{id:userId},
                select:{
                    id:true,
                    aiResponseTone:true
                }
            });
            if(!userData) throw new AppError('Invalid user',400);
            return {
                toneData:tones,
                userData:userData
            }
        });
         const finalDataset = dbData.toneData.map((tone)=>{
            return {
                id:tone.id,
                label:tone.label,
                value:tone.tone,
                isActive:tone.tone === dbData.userData.aiResponseTone?true:false
            }
        });
        return finalDataset;        
    }catch(err){
        throw err;
    }
}
//fetch ai response tone by id
export const fetchAiResponseToneByID = async (id:string):Promise<fetchAiResponseToneByIDRes> => {
    try{
        const data = await db.aITone.findUnique({
            where:{id},
            select:{
                id:true,
                tone:true,
                label:true,
                isActive:true
            }
        });
        if(!data) throw new AppError('Invalid tone',404);
        return data;
    }catch(err){
        throw err;
    }
}

//fetch ai tone dataset
export const fetchAIServicesDataset = async (userId:string):Promise<FetchAIServiceDatasetEach[]> => {
    try{
        const dbData = await db.$transaction(async (tx)=>{
            const services = await tx.aIService.findMany({
                where:{
                    isActive:true
                },
                select:{
                    id:true,
                    name:true
                }
            });
            if(services.length === 0) throw new AppError('AI services not available',404);
            const userData = await tx.user.findUnique({
                where:{id:userId},
                select:{
                    id:true,
                    aiServiceName:true
                }
            });
            if(!userData) throw new AppError('Invalid user',400);
            return {
                aiServiceData:services,
                userData:userData
            }
        });
         const finalDataset = dbData.aiServiceData.map((serviceData)=>{
            return {
                id:serviceData.id,                
                value:serviceData.name,
                isActive:serviceData.name === dbData.userData.aiServiceName?true:false
            }
        });
        return finalDataset;        
    }catch(err){
        throw err;
    }
}
//fetch ai service by id
export const fetchAiServiceByID = async (id:string):Promise<fetchAiServiceByIDRes> => {
    try{
        const data = await db.aIService.findUnique({
            where:{id},
            select:{
                id:true,
                name:true,                
                isActive:true
            }
        });
        if(!data) throw new AppError('Invalid service',404);
        return data;
    }catch(err){
        throw err;
    }
}
//change the service for a user
export const changeProfileAIService = async (id:string,aiServiceName:string):Promise<boolean> => {
    try{
        await db.user.update({
            where:{id},
            data:{aiServiceName}
        });
        return true;
    }catch(err){
        throw err;
    }
}
//stats label, action and iconkey mapping map
const StatsLabelActionIconMapper:Record<string,{label:string,iconKey:string}> = {
    no_action: {label:"No Action", iconKey:"cancel"},
    others: {label:"Others",iconKey:"others"},
    schedule_meeting: {label:"Schedule Meeting", iconKey:"clock"},
    follow_up: {label:"Follow Up",iconKey:"clock"},
    forward: {label:"Forwarded",iconKey:"right_arrow"},
    reply:{label:"Drafted",iconKey:"envelope"}
}
//function to generate service stats
export const generateStats = async (userId:string,to:string,from:string):Promise<GenerateStatsResponse[]> => {
    try{
        const dateFiltration:any = {};
        //TODO: may have to change to show stats for any place's user, then we have to consider the separeate timezones too
        //right now, only utc is done        
        if(to) dateFiltration.gte= new Date(`${to}T23:59:59.999Z`);
        if(from) dateFiltration.lte= new Date(`${to}T00:00:00.000Z`);
        const emailActivityData = await db.emailActivity.groupBy({
            by:['action'],
            where:{
                userId,
                isCompleted:true,
                ...(Object.keys(dateFiltration).length > 0 ?{processedAt:dateFiltration}:{})
            },
            _count:{action:true}  
        });        
        if(emailActivityData.length === 0) throw new AppError('Stats not found',404);
        const response = emailActivityData.map((each)=>{
            return {
                label:StatsLabelActionIconMapper[each.action]?.label || 'Others',
                iconKey:StatsLabelActionIconMapper[each.action]?.iconKey || 'others',
                value:each._count.action
            }
        });
        return response;
    }catch(err){
        throw err;
    }
}