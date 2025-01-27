import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { getSentMessageRequests, connect } from './templateSqs';

describe('SQS connect', () => {
  it('Should connect to mocked SQS', async () => {
    const sqs = await connect({}, {}, 'local');
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue',
        MessageBody: 'This is a test message',
      })
    );

    const sentMessageRequests = getSentMessageRequests(sqs);
    expect(sentMessageRequests).toHaveLength(1);
    expect(sentMessageRequests[0].MessageBody).toBe('This is a test message');
  });
});
