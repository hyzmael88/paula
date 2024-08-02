import moment from "moment";
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart, FaMoneyBillWave, FaRegCommentDots, FaRegImage } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import Link from "next/link";


function Publicacion({
  publicacion,
  comprarPublicacionStripe,
  openVisor,
  session,
  urlFor,
}) {

  const [posicion, setPosicion] = useState(0);

  const handleNext = () => {
    setPosicion((prevPos) => (prevPos + 1) % publicacion.fotografias.length);
  };

  const handlePrev = () => {
    setPosicion((prevPos) => (prevPos - 1 + publicacion.fotografias.length) % publicacion.fotografias.length);
  };

  return (
    <div className="bg-white publicacionShadow overflow-hidden cursor-pointer rounded-[27px]">
      <Link href={`/Modelo/${publicacion.modelo.slug.current}`}>
      <div className="w-full flex justify-between px-4 h-[125px] "
      
      >
        <div className="w-full flex items-center">
          <img
            src={urlFor(publicacion.modelo.fotoPerfil || publicacion.compras.modelo.fotoPerfil).url()}
            alt={publicacion.modelo.nombre}
            className="w-[60px] h-[60px] bg-gray-400 rounded-full mr-4 object-cover"
          />
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-center  ">
            <span className="font-black text-[16px] ">{publicacion.modelo.nombre}</span>
          <span className="text-[#B9B9B9] font-bold text-[11px] pt-3">
            {moment(publicacion._createdAt).fromNow()}
          </span>
        </div>
            <span className="text-[11px] font-bold text-[#B9B9B9]">@{publicacion.modelo.slug.current}</span>
          </div>
        </div>
        
      </div>
      </Link>
      <div className="p-4">
        <h2 className="text-[11px] leading-[13px]">{publicacion.copy}</h2>
      </div>
      {!publicacion.precio ? (
        publicacion.fotografias && publicacion.fotografias.length > 0 && (
          <div className="fotografias mb-4 relative">
            {publicacion.fotografias.length > 1 && (
              <>
                <div className="absolute top-4 right-4 bg-[#2222228F] rounded-[27px] text-white px-2 py-1 z-10">
                  <p className="text-[12px]">{posicion + 1}/{publicacion.fotografias.length}</p>
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[47px] h-[47px] rounded-full z-10 bg-[#B9B9B98C] flex justify-center items-center" onClick={handleNext}>
                  <FaChevronRight className="text-white"/>
                </div>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[47px] h-[47px] rounded-full z-10 bg-[#B9B9B98C] flex justify-center items-center" onClick={handlePrev}>
                  <FaChevronLeft className="text-white"/>
                </div>
              </>
            )}
            <img
              key={publicacion.fotografias[0]}
              src={urlFor(publicacion.fotografias[posicion]).url()}
              alt={`Fotografía `}
              className="w-full h-[330px]  mb-2 cursor-pointer object-cover"
              onClick={() =>
                openVisor(
                  publicacion.fotografias.map((foto) => urlFor(foto).url())
                )
              }
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        )
      ) : session.user.compras &&
        session.user.compras.some(
          (compra) => compra._ref === publicacion._id
        ) ? (
        publicacion.fotografias && publicacion.fotografias.length > 0 && (
          <div className="fotografias mb-4 relative">
            <div className="absolute top-4 right-4 bg-[#2222228F] rounded-[27px] text-white px-2 py-1 z-10">
              <p>1/{publicacion.fotografias.length}</p>
            </div>
            <img
              key={publicacion.fotografias[0]}
              src={urlFor(publicacion.fotografias[0]).url()}
              alt={`Fotografía `}
              className="w-full h-[330px] object-cover mb-2 cursor-pointer"
              onClick={() =>
                openVisor(
                  publicacion.fotografias.map((foto) => urlFor(foto).url())
                )
              }
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        )
      ) : (
        <div className="w-full h-[494px] bg-pink-300 object-cover mb-2 flex flex-col items-center justify-center">
          <div
            className="flex flex-col items-center w-[346px] h-[212px] justify-center gap-y-[7px] bg-[#39383980] rounded-[27px] relative"
            style={{
              background: "rgba(57, 56, 57, 0.50)",
            }}
          >
            <img src="/lock.png" alt="lock" className=" absolute -top-10" />
            <p className="text-[18px] font-bold text-white ">
              Desbloquea para ver
            </p>
            <p className="text-[15px] text-white flex gap-2 items-center ">
              <FaRegImage />1 imagen
            </p>
            <p className="text-white ">${publicacion.precio} mxn</p>
            <div
              className="w-[149px] h-[31px] bg-pink-500 text-center  rounded-3xl text-white cursor-pointer loginButton flex items-center justify-center font-bold desbloquearButton"
              onClick={() => comprarPublicacionStripe(publicacion)}
            >
              Desbloquear
            </div>
          </div>
        </div>
      )}
      <div className="w-full flex justify-between items-center px-8 h-[52px]">
        <div className="flex gap-4">
          <div className="flex  ">
            <span className="text-[11px] flex items-center gap-1 "><FaHeart/>200</span>
          </div>
          <div className=" text-[11px] flex items-center gap-1 ">
          <FaRegCommentDots />
          10 comentarios</div>
        </div>
        <div className="text-[20px] flex gap-2"><FaMoneyBillWave /> <CiBookmark /></div>
      </div>
    </div>
  );
}

export default Publicacion;
