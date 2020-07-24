async function load(url) {
    const str = await fetch(url).then((data) => {
        return data.text()
    })
    const data = await new window.DOMParser().parseFromString(str, 'text/xml')
    console.log('str :>> ', data)
    // .then((data) => {
    console.log('data :>> ', data)
    window.data = data
    const photoGroups = data.getElementsByTagName('Photogroup')
    // for (let index = 0; index < photoGroups.length; index++)
    {
        // const element = photoGroups[index];
        const photoGroup = photoGroups[0]
        const width = Number(
            photoGroup.getElementsByTagName('Width')[0].textContent
        )
        const height = Number(
            photoGroup.getElementsByTagName('Height')[0].textContent
        )
        const focalLength = Number(
            photoGroup.getElementsByTagName('FocalLength')[0].textContent
        )
        const sensorSize = Number(
            photoGroup.getElementsByTagName('SensorSize')[0].textContent
        )
        const [cx, cy] = [
            photoGroup.getElementsByTagName('PrincipalPoint')[0].children[0]
                .textContent,
            photoGroup.getElementsByTagName('PrincipalPoint')[0].children[1]
                .textContent,
        ]
        const fx = (focalLength / sensorSize) * width
        const fy = (focalLength / sensorSize) * width
        const planeSize = {
            x: fx / width,
            y: fy / height,
        }

        const photos = Array.from(photoGroup.getElementsByTagName('Photo'))

        const res = photos.map((photo) => {
            const ImagePath = photo.getElementsByTagName('ImagePath')[0]
                .textContent
            const reg = /([^<>/\\\|:""\*\?]+)\.\w+$/
            const src = ImagePath.match(reg)
            console.log('src :>> ', src[0])

            const Rotation = Array.from(
                photo.getElementsByTagName('Rotation')[0].children
            )
            const rotationArr = Rotation.map((M) => Number(M.textContent))
            const Center = Array.from(
                photo.getElementsByTagName('Center')[1].children
            )
            const posArr = Center.map((M) => Number(M.textContent))
            const retrunRes = []
            for (let index = 0; index < rotationArr.length; index++) {
                const element = rotationArr[index]
                retrunRes.push(element)
                if ((index + 1) % 3 === 0) {
                    retrunRes.push(posArr[Math.floor(index / 3)])
                }
            }
            retrunRes.push(0, 0, 0, 1)
            retrunRes.src = src

            return retrunRes
        })
        console.log('res :>> ', res)
    }
    // })
}

load('./Block_1 - AT - export.xml')
