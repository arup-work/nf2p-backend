import Queue from 'bull';
import sendEmail from './mailer.js';

const emailQueue = new Queue('email', {
   redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
})

emailQueue.on('error', (error) => {
    console.error('Error in emailQueue:', error);
});

emailQueue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is waiting to be processed`);
});

emailQueue.on('active', (job, jobPromise) => {
    console.log(`Job ${job.id} is now active; previous status was ${job.opts.previousState}`);
});

emailQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result ${result}`);
});

emailQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err}`);
});

emailQueue.on('stalled', (job) => {
    console.warn(`Job ${job.id} stalled and will be reprocessed`);
});

// Setup email queue processing
emailQueue.process(async (job) => {
    const { email, subject, template, context } = job.data;
    await sendEmail({ email, subject, template, context })
})

export default emailQueue;