# Purpose
This repo exists to demonstrate k8's pod auto scaling, it consists of the following components:

- a simple nodeJS app that performs some CPU intensive task on each http request.
- helm chart
- app.yaml k8s template consisting of
  - HorizontalPodAutoscaler
  - Service exposing port 8080
  - Deployment

### Commands

#### Docker

`docker build -t mrslwiseman/nodejs-hello-world:latest .`

`docker push mrslwiseman/nodejs-hello-world:latest`

`docker run -e PORT=8080 -p 8080:8080 mrslwiseman/nodejs-hello-world`

#### Helm

`helm install full-coral ./chart`

`helm upgrade full-coral ./chart`

`helm uninstall full-coral`

#### Generate load on the server. Watch the deployment scale up

```RAND=$(shuf -i 0-100000 -n 1); NAME=load-generator$RAND; kubectl run -i --tty $NAME --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://nodejs-hello-world:8080; done"```


# Issues

The HPA appears to not be down scaling the nodeJS server

```
Conditions:
  Type            Status  Reason                   Message
  ----            ------  ------                   -------
  AbleToScale     True    SucceededGetScale        the HPA controller was able to get the target's current scale
  ScalingActive   False   FailedGetResourceMetric  the HPA was unable to compute the replica count: failed to get cpu utilization: unable to get metrics for resource cpu: no metrics returned from resource metrics API
  ScalingLimited  False   DesiredWithinRange       the desired count is within the acceptable range
Events:
  Type     Reason                        Age                   From                       Message
  ----     ------                        ----                  ----                       -------
  Warning  FailedGetResourceMetric       22m                   horizontal-pod-autoscaler  failed to get cpu utilization: did not receive metrics for any ready pods
  Warning  FailedComputeMetricsReplicas  22m                   horizontal-pod-autoscaler  invalid metrics (1 invalid out of 1), first error is: failed to get cpu utilization: did not receive metrics for any ready pods
  Normal   SuccessfulRescale             20m                   horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
  Normal   SuccessfulRescale             15m                   horizontal-pod-autoscaler  New size: 3; reason: cpu resource utilization (percentage of request) above target
  Warning  FailedComputeMetricsReplicas  9m29s (x11 over 23m)  horizontal-pod-autoscaler  invalid metrics (1 invalid out of 1), first error is: failed to get cpu utilization: unable to get metrics for resource cpu: no metrics returned from resource metrics API
  Warning  FailedGetResourceMetric       2m58s (x37 over 23m)  horizontal-pod-autoscaler  failed to get cpu utilization: unable to get metrics for resource cpu: no metrics returned from resource metrics API```
