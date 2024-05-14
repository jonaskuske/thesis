## Initial observations

> 🗓️ last updated 12/10/22

#### Lighthouse: MPA vs. MPA with Stream Stitching

<div align=center>
<p align="center">
<img width="400px" src="https://user-images.githubusercontent.com/30421456/195812208-fe905493-5b09-45f3-a275-6e8a4947a914.png">
<img width="400px" src="https://user-images.githubusercontent.com/30421456/195812231-7406442a-9d12-413f-ba66-7cdc2f2543b3.png">
</p>
</div>

In the early prototype consisting of just two simple pages, performance is stellar for both versions. Still, utilizing a Service Worker with stream stitching reduces both First and Largest Contentful Paint by up to 1s. However, the implementation complexity for the architecture with Stream Stitching is already a lot higher than for the one without it, with many edge cases to handle. Whether the complexity peaks at some point or keeps increasing as the app grows is a crucial aspect of the architecture comparison.

Another interesting observation is that stream stitching caused a higher Total Blocking Time. It's still low in this test, but looking at other test runs under different conditions, it seems to increase with network delays and server response times, while it doesn't for the plain MPA. This requires further investigation.
