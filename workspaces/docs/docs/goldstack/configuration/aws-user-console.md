[%Step-by-step Video Guide](https://www.youtube.com/embed/-lWrkpzEgfs)

The easiest way to configure the AWS user for Goldstack is to do it during project setup by providing an _AWS Access Key Id_ and _AWS Secret Access Key_. To obtain these, please do the following:

- Create an AWS account if you do not already have one. See [instructions on this from AWS here](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).
- Open the AWS console IAM management and sign in if required: https://console.aws.amazon.com/iam/home?region=us-east-1#/home
- Click on _Users_ in the menu on the right

![Add User in AWS console](https://cdn.goldstack.party/img/202010/add_user.png)

- Provide a username of your choice, for instance 'goldstack-local-dev'
- Select the Access Type _Programmatic Access_

![Provide user details](https://cdn.goldstack.party/img/202010/user_details.png)

- Click on the button _Next: Permissions_
- Select _Attach existing policies directly_
- Select the Policy [_PowerUserAccess_](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html#jf_developer-power-user)

![Select permissions](https://cdn.goldstack.party/img/202010/permissions.png)

- Click on the button _Next: Tags_
- You do not have to add any tags, just click _Next: Review_
- On the review page click _Create User_

Now you can copy the _Access Key ID_ and add it to the Goldstack configuration form. Do the same with the _Secret Access Key_ (It can be shown by clicking on Show).

![Obtain access keys](https://cdn.goldstack.party/img/202010/keys.png)

Note that it is recommended to only provide this key and secret for development systems (and prototype/hobby production systems). For all other systems, it is recommended to provide this key and secret only through environment variables (see below).
