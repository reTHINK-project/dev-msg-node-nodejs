# performance test from [testbeds mntest](https://github.com/reTHINK-project/testbeds/tree/master/dev/mntest)
### running debian 8 & docker on Intel(R) Core(TM) i5-2320 CPU @ 3.00GHz
#### Hyperty address allocation performance for different numbers of addresses
  ✔ prepare: connect stub

INFO: 'nodejs - Duration for allocation of 100 x 1 addresses : 344'  
  ✔ 100 hyperty address allocation requests for 1 address each  

LOG: 'Duration for de-allocation of 100 x 1 addresses :183 msecs'  
  ✔ 100 hyperty address de-allocation requests for 1 address each

INFO: 'nodejs - Duration for allocation of 100 x 3 addresses : 210'  
  ✔ 100 hyperty address allocation requests for 3 addresses each

LOG: 'Duration for de-allocation of 100 x 3 addresses :194 msecs'  
  ✔ 100 hyperty address de-allocation requests for 3 addresses each

INFO: 'nodejs - Duration for allocation of 100 x 3 addresses with allocationKey: 241'  
  ✔ 100 hyperty address allocation requests for 3 addresses each with allocationKey

LOG: 'Duration for de-allocation of 100 x 3 addresses with allocationKey: 188 msecs'  
  ✔ 100 hyperty address de-allocation requests for 3 addresses each with allocationKey

INFO: 'nodejs - Duration for allocation of 1000 x 1 addresses : 2202'  
  ✔ 1000 hyperty address allocation requests for 1 address each

LOG: 'Duration for de-allocation of 1000 x 1 addresses :1805 msecs'  
  ✔ 1000 hyperty address de-allocation requests for 1 address each

INFO: 'nodejs - Duration for allocation of 1000 x 3 addresses : 2205'  
  ✔ 1000 hyperty address allocation requests for 3 addresses each

LOG: 'Duration for de-allocation of 1000 x 3 addresses :1767 msecs'  
  ✔ 1000 hyperty address de-allocation requests for 3 addresses each

INFO: 'nodejs - Duration for allocation of 1000 x 3 addresses with allocationKey: 2171'  
  ✔ 1000 hyperty address allocation requests for 3 addresses each with allocationKey

LOG: 'Duration for de-allocation of 1000 x 3 addresses with allocationKey: 1734 msecs'  
  ✔ 1000 hyperty address de-allocation requests for 3 addresses each with allocationKey

INFO: 'nodejs - Duration for allocation of 10000 x 1 addresses : 21961'  
  ✔ 10000 hyperty address allocation requests for 1 address each

LOG: 'Duration for de-allocation of 10000 x 1 addresses :18465 msecs'  
  ✔ 10000 hyperty address de-allocation requests for 1 address each

INFO: 'nodejs - Duration for allocation of 10000 x 3 addresses : 22315'  
  ✔ 10000 hyperty address allocation requests for 3 addresses each

LOG: 'Duration for de-allocation of 10000 x 3 addresses :18704 msecs'  
  ✔ 10000 hyperty address de-allocation requests for 3 addresses each

INFO: 'nodejs - Duration for allocation of 10000 x 3 addresses with allocationKey: 22842'  
  ✔ 10000 hyperty address allocation requests for 3 addresses each with allocationKey

LOG: 'Duration for de-allocation of 10000 x 3 addresses with allocationKey: 19206 msecs'  
  ✔ 10000 hyperty address de-allocation requests for 3 addresses each with allocationKey

  ✔ cleanup: disconnect stub


#### Object address allocation performance for different numbers of addresses
  ✔ prepare: connect stub

INFO: 'nodejs - Duration for allocation of 100 x 1 addresses : 323'  
  ✔ 100 object address allocation requests for 1 address each

LOG: 'Duration for de-allocation of 100 x 1 addresses :185 msecs'  
  ✔ 100 object address de-allocation requests for 1 address each

INFO: 'nodejs - Duration for allocation of 100 x 3 addresses : 223'  
  ✔ 100 object address allocation requests for 3 addresses each

LOG: 'Duration for de-allocation of 100 x 3 addresses :191 msecs'  
  ✔ 100 object address de-allocation requests for 3 addresses each

INFO: 'nodejs - Duration for allocation of 100 x 3 addresses with allocationKey: 202'  
  ✔ 100 object address allocation requests for 3 addresses each with allocationKey

LOG: 'Duration for de-allocation of 100 x 3 addresses with allocationKey: 174 msecs'  
  ✔ 100 object address de-allocation requests for 3 addresses each with allocationKey

INFO: 'nodejs - Duration for allocation of 1000 x 1 addresses : 2293'  
  ✔ 1000 object address allocation requests for 1 address each

LOG: 'Duration for de-allocation of 1000 x 1 addresses :1893 msecs'  
  ✔ 1000 object address de-allocation requests for 1 address each

INFO: 'nodejs - Duration for allocation of 1000 x 3 addresses : 2308'  
  ✔ 1000 object address allocation requests for 3 addresses each

LOG: 'Duration for de-allocation of 1000 x 3 addresses :1904 msecs'  
  ✔ 1000 object address de-allocation requests for 3 addresses each

INFO: 'nodejs - Duration for allocation of 1000 x 3 addresses with allocationKey: 2387'  
  ✔ 1000 object address allocation requests for 3 addresses each with allocationKey

LOG: 'Duration for de-allocation of 1000 x 3 addresses with allocationKey: 1954 msecs'  
  ✔ 1000 object address de-allocation requests for 3 addresses each with allocationKey

INFO: 'nodejs - Duration for allocation of 10000 x 1 addresses : 22919'  
  ✔ 10000 object address allocation requests for 1 address each

LOG: 'Duration for de-allocation of 10000 x 1 addresses :18370 msecs'  
  ✔ 10000 object address de-allocation requests for 1 address each

INFO: 'nodejs - Duration for allocation of 10000 x 3 addresses : 24223'  
  ✔ 10000 object address allocation requests for 3 addresses each

LOG: 'Duration for de-allocation of 10000 x 3 addresses :18813 msecs'  
  ✔ 10000 object address de-allocation requests for 3 addresses each

INFO: 'nodejs - Duration for allocation of 10000 x 3 addresses with allocationKey: 22672'  
  ✔ 10000 object address allocation requests for 3 addresses each with allocationKey

LOG: 'Duration for de-allocation of 10000 x 3 addresses with allocationKey: 18490 msecs'  
  ✔ 10000 object address de-allocation requests for 3 addresses each with allocationKey

  ✔ cleanup: disconnect stub


#### messaging performance for different message sizes and iterations
  ✔ prepare: connect 2 stubs and allocate hyperties 1 and 2

INFO: 'nodejs - Duration for 100 messages of size 100: : 167'  
  ✔ send 100B x 100 times

INFO: 'nodejs - Duration for 100 messages of size 1024: : 183'  
  ✔ send 1kB x 100 times

INFO: 'nodejs - Duration for 100 messages of size 10240: : 211'  
  ✔ send 10kB x 100 times

INFO: 'nodejs - Duration for 1000 messages of size 100: : 1905'  
  ✔ send 100B x 1000 times

INFO: 'nodejs - Duration for 1000 messages of size 1024: : 1871'  
  ✔ send 1kB x 1000 times

INFO: 'nodejs - Duration for 1000 messages of size 10240: : 2385'  
  ✔ send 10kB x 1000 times

INFO: 'nodejs - Duration for 10000 messages of size 100: : 18029'  
  ✔ send 100B x 10000 times

INFO: 'nodejs - Duration for 10000 messages of size 1024: : 16969'  
  ✔ send 1kB x 10000 times

INFO: 'nodejs - Duration for 10000 messages of size 10240: : 18747'  
  ✔ send 10kB x 10000 times


#### messaging object update performance for different number of subscribers
  ✔ prepare: allocate object address

INFO: 'nodejs - Duration for 10 subscribers and payload-size of 100: 48'  
  ✔ subscribe and publish event with 100 listeners and 100B size

INFO: 'nodejs - Duration for 100 subscribers and payload-size of 100: 294'  
  ✔ subscribe and publish event with 100 listeners and 100B size

INFO: 'nodejs - Duration for 100 subscribers and payload-size of 1024: 327'  
  ✔ subscribe and publish event with 100 listeners and 1kB size

INFO: 'nodejs - Duration for 100 subscribers and payload-size of 10240: 435'  
  ✔ subscribe and publish event with 100 listeners and 10kB size

INFO: 'nodejs - Duration for 200 subscribers and payload-size of 100: 592'  
  ✔ subscribe and publish event with 200 listeners and 100B size

INFO: 'nodejs - Duration for 200 subscribers and payload-size of 1024: 623'  
  ✔ subscribe and publish event with 200 listeners and 1kB size

INFO: 'nodejs - Duration for 200 subscribers and payload-size of 10240: 882'  
  ✔ subscribe and publish event with 200 listeners and 10kB size

INFO: 'nodejs - Duration for 1000 subscribers and payload-size of 100: 3195'  
  ✔ subscribe and publish event with 1000 listeners and 100B size

INFO: 'nodejs - Duration for 1000 subscribers and payload-size of 1024: 3337'  
  ✔ subscribe and publish event with 1000 listeners and 1kB size

INFO: 'nodejs - Duration for 1000 subscribers and payload-size of 10240: 4519'  
  ✔ subscribe and publish event with 1000 listeners and 10kB size

Finished in 6 mins 31.277 secs / 6 mins 26.096 secs

#### SUMMARY:
✔ 61 tests completed
