import { fetchAiResponseToneByIDRes, fetchAiServiceByIDRes, PriorityUpdate, UpdateEmailAccountIntput } from "../controllers/v1/types";
import db from "../../db"
import { AIResponseTone, Prisma } from "../../generated/prisma";
import AppError from "../utils/appError.utils";
import { LinkAccountResponse } from "./link-account/types";
import { LinkCalendarAccountResponse } from "./link-calendar-account/types";
import { EmailAccountData,FetchActionItemsDataFormat,FetchAIServiceDatasetEach,FetchAIToneDatasetEach,GenerateStatsResponse, UserData, UserDataByEmail, UserProfileData } from "./types";
import { EmailProcessingPayload } from "../../types/types";
import env from "../../config/env";
import { getEmailProcessingQueue } from "../../queues/emailProcessingQueue";
import { logger } from "../../config/logger";

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
        if(accounts.length === 0) throw new AppError('no accounts found',404);
        const accountData = accounts.map(function(account){
            return {
                id:account.id,
                email:account.emailAddress,
                isActive:account.isActive,
                provider:account.provider,
                priority:account.priorityWeight,
                createdAt:account.createdAt,
                deletedAt:account.deletedAt
            }
        });
        return accountData;
    }catch(err){
        throw err;
    }
}
//to check if any email account exist for the user or not(active or inactive, any)
export const doesAnyEmailAccExist = async (userId:string):Promise<boolean> => {
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
        return accounts.length === 0?false:true;
    }catch(err){
        throw err;
    }
}
export const createEmailAccount = async (providerResponse:LinkAccountResponse,userId:string):Promise<string> => {
    try{
        return await db.$transaction(async(tx)=>{
            const existingEmailAccounts =await tx.emailAccount.findMany({where:{userId}});
            const isAccountWithSameMail = existingEmailAccounts.some((each)=>each.emailAddress === providerResponse.email);
            if(isAccountWithSameMail) throw new AppError('Email account already exists',409);
            const emailAccountData = await tx.emailAccount.create({
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
            return emailAccountData.id;
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
                createdAt:account.createdAt,
                deletedAt:account.deletedAt
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
            if(activityCount === 0){
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
            if(activityCount === 0){
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
        if(to) dateFiltration.lte= new Date(`${to}T23:59:59.999Z`);
        if(from) dateFiltration.gte= new Date(`${from}T00:00:00.000Z`);
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

//get data for manual trigger(for internal call in this user service. when new email account is created)
export const triggerEmailProcessingManually = async (userId:string,emailAccId:string):Promise<void> => {
    try{
        let emailProcessingQueue = getEmailProcessingQueue();
        const allInFlightJobs = await emailProcessingQueue.getJobs(['waiting','active']);
        const isActiveJobPresent = allInFlightJobs.some((each)=>{
            return (each.data.general_data.user_id === userId && each.data.general_data.email_account_id === emailAccId)
        });
        if(isActiveJobPresent){
            logger.warn(`first email processing trigger failed`,{
                userId,
                emailAccId,
                message: "a job is already in queue"                
            });
            return;
        }
        const userDataWithEmailAndCalendarAcc = await db.user.findFirst(
            {
                where:{
                    id:userId,                   
                    isActive:true,                 
                },
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
                    emailAccounts:{
                        where:{isActive:true,deletedAt:null,id:emailAccId},
                        select:{
                            id:true,
                            emailAddress:true,
                            appPassword:true,
                            accessToken:true,
                            refreshToken:true,
                            smtpHost:true,
                            smtpPort:true,
                            imapHost:true,
                            imapPort:true,
                            provider:true,
                            priorityWeight:true
                        }
                    },
                    calendarAccounts:{
                        where:{isActive:true,deletedAt:null},
                        select:{
                            id:true,
                            emailAddress:true,
                            accessToken:true,
                            refreshToken:true,
                            provider:true,
                            isActive:true
                        }
                    },                  
                }
            },
        );
        if(!userDataWithEmailAndCalendarAcc){
            logger.warn(`first email processing trigger failed`,{
                userId,
                emailAccId,
                message: "user not found"                
            });
            return;
        }
        if(userDataWithEmailAndCalendarAcc.emailAccounts.length === 0){
            logger.warn(`first email processing trigger failed`,{
                userId,
                emailAccId,
                message: "email account not found"                
            });
            return;
        }
        if(userDataWithEmailAndCalendarAcc.calendarAccounts.length === 0){
            logger.warn(`first email processing trigger failed`,{
                userId,
                emailAccId,
                message: "calendar account not found"                
            });
            return;
        }
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        const emailProcessingQueueData:EmailProcessingPayload = {
            n8n_payload:{
                process_quantity:15,
                calendar_mail:userDataWithEmailAndCalendarAcc.calendarAccounts[0].emailAddress,
                calendar_refresh_token:userDataWithEmailAndCalendarAcc.calendarAccounts[0].refreshToken ?? '',
                calendar_provider:userDataWithEmailAndCalendarAcc.calendarAccounts[0].provider, 
                subscription_date:sevenDaysAgo,
                google_project_client_id:env.GOOGLE_CLIENT_ID,
                google_project_client_secret:env.GOOGLE_CLIENT_SECRET,
                microsoft_project_client_id:env.MICROSOFT_CLIENT_ID,
                microsoft_project_client_secret:env.MICROSOFT_CLIENT_SECRET,
                microsoft_project_object_id:env.MICROSOFT_OBJECT_ID,             
                subject_email:userDataWithEmailAndCalendarAcc.emailAccounts[0].emailAddress,
                subject_provider:userDataWithEmailAndCalendarAcc.emailAccounts[0].provider,
                subject_password:userDataWithEmailAndCalendarAcc.emailAccounts[0].appPassword ?? '',
                subject_refresh_token:userDataWithEmailAndCalendarAcc.emailAccounts[0].refreshToken ?? '',
                subject_imap_url:userDataWithEmailAndCalendarAcc.emailAccounts[0].imapHost ?? '',
                subject_imap_port:userDataWithEmailAndCalendarAcc.emailAccounts[0].imapPort ?? 0,
                subject_smtp_url:userDataWithEmailAndCalendarAcc.emailAccounts[0].smtpHost ?? '',
                subject_smtp_port:userDataWithEmailAndCalendarAcc.emailAccounts[0].smtpPort ?? 0  
            },
            general_data:{
                user_id:userDataWithEmailAndCalendarAcc.id,
                ai_response_tone:userDataWithEmailAndCalendarAcc.aiResponseTone,
                ai_service_name:userDataWithEmailAndCalendarAcc.aiServiceName,
                plan_id:null,
                subscription_id:null,
                email_account_id:userDataWithEmailAndCalendarAcc.emailAccounts[0].id,
                calendar_account_id:userDataWithEmailAndCalendarAcc.calendarAccounts[0].id
            }                                                
        }
        await emailProcessingQueue.add('email-processing',emailProcessingQueueData,{
            jobId:`${userId}-${emailAccId}`
        });
        await db.emailAccount.update({
            where:{id:emailAccId},
            data:{isManuallyTriggered:true}
        });
        return;
    }catch(err){
        logger.warn(`first email processing trigger failed`,{
            message: err instanceof Error?err.message:"unknown error",
            stack: err instanceof Error?err.stack:null
        });
        return;
    }
}
//get action items for a user is a proper format
export const fetchActionItems = async (to:string,from:string,type:string,userId:string):Promise<FetchActionItemsDataFormat[]> => {
    try{
       let actionItemsFilter:any = {};
       let orderby:any[] = []; 
       actionItemsFilter.isSeen = false;
       if(type === '0'){
            const today = new Date();
            today.setUTCHours(0,0,0,0);
            actionItemsFilter.deadline = {gte:today};
            orderby.push({deadline:'desc'},{priority:'asc'});
       }else if(type === '1'){
            orderby.push({priority:'asc'});            
            actionItemsFilter.deadline = null;
            if (to || from) {
                actionItemsFilter.createdAt = {};
                
                if (to) {
                    actionItemsFilter.createdAt.lte = new Date(`${to}T23:59:59.999Z`);
                }
                if (from) {
                    actionItemsFilter.createdAt.gte = new Date(`${from}T00:00:00.000Z`);
                }
            }
       }       
       const data = await db.user.findFirst({
        where:{id:userId},
        orderBy:orderby,
        select:{
            id:true,
            name:true,
            email:true,
            emailActivities:{
                select:{
                    actionItems:{
                        where:actionItemsFilter,
                        select:{
                            id:true,
                            emailActivityId:true,
                            summary:true,
                            deadline:true,
                            createdAt:true,
                            isSeen:true,
                            priority:true
                        }
                    }
                }
            }
        }
       });
       if(!data) throw new AppError('User not found',404);
       if(data.emailActivities.length === 0) throw new AppError('No email accounts found',404);
       const finalData = data.emailActivities.flatMap((eachEmailActivity) => {         
          const actionItemDataArray = eachEmailActivity.actionItems.map((eachActionItem) => {
                return {
                    label:eachActionItem.summary,
                    priority:eachActionItem.priority,
                    deadline:eachActionItem.deadline,
                    dateCreated:eachActionItem.createdAt,
                    isSeen:eachActionItem.isSeen,
                    id:eachActionItem.id
                }
          });
          return actionItemDataArray;
       });
       return finalData;
    }catch(err){
        throw err;
    }
}
//find action item by id 
export const findActionItemById = async (id:string):Promise<{id:string,isSeen:boolean}> => {
    try{
        const data = await db.actionItem.findUnique({
            where:{id},
            select:{
                id:true,
                isSeen:true
            }
        });
        if(!data) throw new AppError('Action item not found',404);
        return data;
    }catch(err){
        throw err;
    }
}
//toggle is seen of action item
export const changeIsSeenOfActionItem = async (id:string,currentIsSeen:boolean) => {
    try{
        await db.actionItem.update({
            where:{id},
            data:{isSeen:!currentIsSeen}
        });
        return true;
    }catch(err){
        throw err;
    }
}
//deactivate the user
export const deactivateUser = async (id:string):Promise<boolean> => {
    try{
        await db.user.update({
            where:{id},
            data:{isActive:false}
        });
        return true;
    }catch(err){
        throw err;
    }
}
//updating email account(custom ones)
export const updateEmailAccountData = async (userId:string,emailAccId:string,data:UpdateEmailAccountIntput):Promise<boolean> => {
    try{
        await db.emailAccount.update({
            where:{id:emailAccId,userId},
            data:{
                emailAddress:data.email,
                appPassword:data.password,
                imapHost:data.imap_host,
                imapPort:data.imap_port,
                smtpHost:data.smtp_host,
                smtpPort:data.smtp_port
            }
        });
        return true;
    }catch(err){
        throw err;
    }
}