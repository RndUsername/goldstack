[!embed](./../shared/getting-started-project.md)

[!embed](./../shared/getting-started-infrastructure.md)

### 3. Development

This is how an the S3 package can be used from another package:

```javascript
import { getBucketName, connect } from 'my-s3-module';

const s3 = connect();
await s3.putObject({
  BucketName: getBucketName(),
  Key: 'my-doc',
  Body: 'content',
});
```

The object returned from `connect()` is an instance of the [AWS S3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html).

Note it is also possible to add additional TypeScript files in the templates `src/` folder. This is a good place to put an abstraction layer on top of the S3 interface, for instance a data repository specific to the needs of your application.
