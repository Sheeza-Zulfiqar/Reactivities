import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../layout/models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";

export default class ActivityStore {
     //oberservable
    activityRegistry=new Map<string,Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }
    get activitiesByDate(){
        return Array.from(this.activityRegistry.values())
        .sort((a,b)=>(a.date!.getTime()) - b.date!.getTime()
    );

    }
    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities,activity)=>{
                const date=format(activity.date!,'dd MMM yyyy');   //activity.date!.toISOString().split('T')[0];
                activities[date]=activities[date] ? [...activities[date],activity] : [activity];
                return activities;
            },{}as {[key:string]: Activity[]})
        )
    }
    //using arrow function will automatically binds this function to the class, else explicity need to bind this loadActivities method to this class
    //action
    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);

        }
        catch (error) {
            console.log(error);
            this.setLoadingInitial(false);

        }

    }
    loadActivity=async(id:string)=>{
        let activity=this.getActivity(id);
        if(activity) {
            this.selectedActivity=activity;
            return activity;
        }
        else{
            this.setLoadingInitial(true);
            try{
                activity=await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>this.selectedActivity=activity);
                this.setLoadingInitial(false);
                return activity;
            }
            catch(error){
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }
    private setActivity=(activity:Activity)=>{
        activity.date=new Date(activity.date!);
        // activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id,activity);
    }
    private getActivity=(id:string)=>{
        return this.activityRegistry.get(id);
    }
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }
    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;

            })

        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                // if(this.selectedActivity?.id==id) this.cancelSelectedActivity;
                this.loading = false;

            })

        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}
