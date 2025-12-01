import cron from "node-cron";


export const initializeScheduledTasks = (): void => {
  cron.schedule("*/15 * * * *", async () => {
    // await updatePastAppointments();
  });

  cron.schedule("*/15 * * * *", async () => {
    // await sendAppointmentReminders();
  });
};
