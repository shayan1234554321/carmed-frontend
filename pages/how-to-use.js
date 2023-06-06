import { DangerButton, MuteButton, PrimaryButton, SecondaryButton, SuccessButton } from "@elements/button";
import { StyledDropdown } from "@elements/dropdown";
import { InputFormField, PasswordInput } from "@elements/input";
import { BeakerIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FieldCheckbox, RadioFormField } from "@elements/common";
import styled from "styled-components"

const Schema = yup.object().shape({
  name: yup.string("Email is required").email("must be email").required("email is required"),
  isPartnered: yup.boolean("asdas"),
  gender: yup.string().required("Gender is Required")
});

export default function Home() {
    const options = [
      {text: "hello", value: '1'},
      {text: "hi", value: '2'},
    ];

  const [value, setValue] = useState([]);
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const submit = (data) => {
    console.log("data: ", data);
  }

  const radioOptions = [
    {value: "male", text: "Male"},
    {value: "female", text: "Female"},
  ]

  return (
    <>
      <h3>Landing P</h3>
      <DangerButton icon={<BeakerIcon/>} >Danger</DangerButton>
      <SuccessButton icon={<BeakerIcon/>} >Success</SuccessButton>
      <SecondaryButton icon={<BeakerIcon/>} loading >Secondary Button</SecondaryButton>
      <PrimaryButton icon={<BeakerIcon/>} >Primary Button</PrimaryButton>
      <MuteButton icon={<BeakerIcon/>}>Mute Button</MuteButton>
      <StyledDropdown 
        options={options}
        value={value}
        setValue={setValue}
      />
      <PasswordInput/>
      <form onSubmit={handleSubmit(submit)} >
        <InputFormField
          control={control}
          name="name"
          label="Name"
          hint={errors?.name?.message}
        />
        <FieldCheckbox
          control={control}
          name="isPartnered"
          label="Partnered"
          hint={errors?.isPartnered?.message}
        />
        <RadioFormField
          name="gender"
          control={control}
          options={radioOptions}
          hint={errors?.gender?.message}
        />
        <PrimaryButton type="submit" >Submit</PrimaryButton>
      </form>
    </>
  )
}


import AddressPopup from "@elements/Google/addressSelector";
import { HouseLine, MapPin } from "phosphor-react";
import UserService from "@utility/services/user";

const AddressContainer = styled.div`
    padding: 10px;
    border: 1px solid ${({theme}) => theme.colors.darkPurple};
    border-radius: 5px;
    width: 300px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const LocationName = styled.div`
    display: flex;
    align-items: center;
    column-gap: 10px;
    h4, h3{
        font-size: 15px;
        margin-bottom: 10px;
    }
    h3{
        font-weight: 400;
    }
`

const Addresses = styled.div`
    display: flex;
    margin-top: 50px;
    column-gap: 20px;
`

const BodyContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin-top: 20vh;
    .order-btn{
        margin-top: 20px;
    }
`

const Booking = () => {

    const [modal, setModal] = useState(false);
    const [destinationNo, setDestinationNo] = useState(1);

    const [origin, setOrigin] = useState({
        name: '',
        lat: '',
        lng: ''
    })
    
    const createOrder = async () => {
        const payload = {
            client: {
                name: "t1",
                password: "t1",
                email: "t1",
            }
        }
        try {

            const res = await UserService.add(payload);
            
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const [destination, setDestination] = useState({
        name: '',
        lat: '',
        lng: ''
    })

    const openModal = () => {
        setModal(true);
    }

    const onCloseCalled = (latLng, name) => {
        if(destinationNo === 1){
            setOrigin({
                name,
                ...latLng
            })
        } else {
            setDestination({
                name,
                ...latLng
            })
        }
        setModal(false);
    }

    return(<>
        <BodyContainer>
            <h3>Booking</h3>
            <Addresses>
                <AddressContainer>
                    <LocationName>
                        <h3>Origin:</h3>
                        <h4>{origin.name? origin.name : "No Location Selected"}</h4>
                    </LocationName>
                    <MuteButton 
                        onClick={() => {
                            setDestinationNo(1); 
                            openModal()
                        }} 
                        icon={<MapPin size={20} />}
                    > 
                        Select Origin
                    </MuteButton>
                </AddressContainer>
                <AddressContainer>
                    <LocationName>
                        <h3>Destination:</h3>
                        <h4>{destination.name? destination.name : "No Location Selected"}</h4>
                    </LocationName>
                    <MuteButton 
                        onClick={() => {
                            setDestinationNo(2); 
                            openModal()
                            }} 
                        icon={<HouseLine size={20} />}
                    >
                        Select Destination
                    </MuteButton>
                </AddressContainer>
            </Addresses>
            <SecondaryButton onPress={() => createOrder()} className="order-btn" >TEST</SecondaryButton>
            {(origin.name && destination.name)?
                <SecondaryButton className="order-btn" >Order Now!</SecondaryButton>
                : <></>
            }
        </BodyContainer>
        <AddressPopup
            open={modal}
            onClose={onCloseCalled}
        />
    </>
    )
}

// ------------------------ For location -------------------------------------------

import { geocodeByLatLng } from 'react-google-places-autocomplete';

const mapClicked = (e, m) => {
    setSelected({
      lat: m.center.lat(),
      lng: m.center.lng()
    });
  
    geocodeByLatLng({ lat: m.center.lat(), lng: m.center.lng() })
      .then((results) => {
        console.log(results[0].address_components);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  geocodeByLatLng({ lat: m.center.lat(), lng: m.center.lng() })
  .then((results) => {
    const addressComponents = results[0].address_components;
    let country, city, province;

    for (let i = 0; i < addressComponents.length; i++) {
      const component = addressComponents[i];
      const types = component.types;

      if (types.includes('country')) {
        country = component.long_name;
      }

      if (types.includes('locality')) {
        city = component.long_name;
      }

      if (types.includes('administrative_area_level_1')) {
        province = component.long_name;
      }
    }

    console.log(`Country: ${country}, City: ${city}, Province/State: ${province}`);
  })
  .catch((error) => {
    console.log(error);
  });