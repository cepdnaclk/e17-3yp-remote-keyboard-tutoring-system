import styled from 'styled-components'

export const Layout = styled.div`
    height: 100%;
    width: 100%;

    display: grid;
    place-items: center;

    background: ;
`

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 36px;
    box-shadow:
  0px 0px 2.2px rgba(0, 0, 0, 0.011),
  0px 0px 5.3px rgba(0, 0, 0, 0.016),
  0px 0px 10px rgba(0, 0, 0, 0.02),
  0px 0px 17.9px rgba(0, 0, 0, 0.024),
  0px 0px 33.4px rgba(0, 0, 0, 0.029),
  0px 0px 80px rgba(0, 0, 0, 0.04)
;
    border-radius: 20px;
    text-align: center;
    width: 100%;

    p {
        margin-top: -10px;
        color: #777;
    }
`

export const BoxUpload = styled.div`
    display: grid;
    place-items: center;
    border: 1px dashed #799CD9;
    /* padding: 36px 48px; */
    position: relative;

    height: 350px;
    width: 100%;

    background: #FBFBFF;
    border-radius: 20px;

    .image-upload {
        display: flex;
        flex-wrap:wrap;

        label {
            cursor: pointer;
        
            :hover {
                opacity: .8;
            }
        }

        >input {
            display: none;
        }
    }
`

export const ImagePreview = styled.div`
    position: relative;
    /* cursor: pointer; */

    #uploaded-image{
        height: 350px;
        width: 100%;
        object-fit: cover;
    }

    .close-icon{
        background: #000;
        border-radius: 5px;
        opacity: .8;

        position: absolute;
        z-index: 10;
        right: 15px;
        top: 20px;
        cursor: pointer;

        :hover {
            opacity: 1;
        }   
    }
`