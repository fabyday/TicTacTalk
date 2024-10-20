import asyncio 


loop = asyncio.get_event_loop()

async def test(index):
    
    print("index ; " , index )
    if index != 2 : 
        loop.create_task(test(2))
    await asyncio.sleep(index)
    print("i sleeped", index) 
        
        
loop.create_task(test(1))
loop.run_forever()
