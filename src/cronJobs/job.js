import cron from "node-cron"
import { User } from "../models/user.model.js"
import { Task } from "../models/task.model.js"



export function startTaskReminder() {

    // Every day at 8:00 AM
    cron.schedule("0 8 * * *", async () => {
        const today = new Date.now().toISOString().split("T")[0];

        const tasks = await Task.find({
            dueDate: { $eq: today },
            status: { $ne: 'Completed' }
        }).populate('assignedTo');

        const reminders = {};

        tasks.forEach(task => {
            const userId = task.assignedTo._id.toString();
            if (!reminders[userId]) reminders[userId] = [];
            reminders[userId].push(task.title);
        });



        console.log(`[CRON] Sent task reminders to ${Object.keys(reminders).length} users`);

    })

}